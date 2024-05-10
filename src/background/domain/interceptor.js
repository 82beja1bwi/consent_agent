import Contract from './models/contract.js'
import Header, { NegotiationStatus } from './models/header.js'
import Proposal from './models/proposal.js'

import Negotiator from './negotiator.js'
import ContractRepository from '../storage/contracts_repository.js'
import PreferenceManager from './preference_manager.js'
import ProposalRepository from '../storage/proposalRepository.js'
import Consent from './models/consent.js'

export default class Interceptor {
  /**
   *
   * @param {ContractRepository} contractRepository
   * @param {ProposalRepository} proposalRepository
   * @param {Negotiator} negotiator
   * @param {PreferenceManager} preferenceManager
   */
  constructor (
    contractRepository,
    proposalRepository,
    negotiator,
    preferenceManager
  ) {
    this.contractRepository = contractRepository
    this.proposalRepository = proposalRepository
    this.preferenceManager = preferenceManager
    this.negotiator = negotiator
  }

  async handleGetData (hostname) {
    const proposal = await this.proposalRepository.getProposal(hostname)
    let proposals = null

    if (proposal) {
      const is2C = !!(!proposal.cost || proposal?.cost === 0)
      proposals = await this.negotiator.createSimilarAlternatives(
        3,
        is2C,
        hostname
      )
    }

    const contract = await this.contractRepository.getContract(hostname)
    const sitesPrefs = await this.preferenceManager.getSitesPreferences(
      hostname,
      false
    )
    const costResolutions = sitesPrefs?.cost.getResolutionsKeys()
    // const costPreferences = {} // [0, 2, 8, 10]
    return { proposals, contract, costResolutions }
  }

  /**
   * maps the UI scale (likert-like) to a decimal scale as seen in ScoredPreferences
   *
   * likert scale from 1 worst to 6 best
   *
   * from {0 Eur: 6, 1 Eur: 5,..., 20 Eur: 1}
   * to {0 Eur: 1, 1 Eur 0.2, ...}
   *
   * @param {String} hostname mail.google.com
   * @param {Object} resolutions {0: 6, 1: 5,...} key is EUR, value is score on likert (6 best, 1 worst)
   * @returns Header ...{0: 1, 1: 0.8, ...}
   */
  async handleUpdatedCostPreferences (hostname, resolutions) {
    // read like
    // 'likert score 1 results in a preference score of 0' -> least desired
    // 'likert score 6 results in a preference score of 1' -> most desired
    const mapping = {
      1: 0,
      2: 0.2,
      3: 0.4,
      4: 0.6,
      5: 0.8,
      6: 1
    }

    for (const key in resolutions) {
      resolutions[key] = mapping[resolutions[key]]
    }

    const prefs = await this.preferenceManager.createUsers3CPreferences(
      hostname,
      resolutions
    )

    return new Header()
      .setStatus(NegotiationStatus.EXCHANGE)
      .setPreferences(prefs)
  }

  async handleAcceptedProposal (hostname, proposal) {
    // creating header
    const consent = Consent.fromObject(proposal.consent)

    proposal.userHasAccepted = true
    this.proposalRepository.setProposal(proposal)
    // TODO notify domain
    return new Header()
      .setStatus(NegotiationStatus.ACCEPTED)
      .setConsent(consent)
      .setCost(proposal.cost)
      .setContent(proposal.content)
  }

  /**
   * For a certain host an initial contract is created, stored and returned
   * @param {*} hostName
   * @returns Header header containing an initial contract proposal
   */
  async onBeforeSendHeaders (hostName) {
    let header = null

    const contract = await this.contractRepository.getContract(hostName)

    if (!contract) {
      console.log('No contract found for host:', hostName)
      // Construct initial header
      await this.preferenceManager.initUsersPreferences(hostName)

      header = this.negotiator.prepareInitialOffer()

      // Set up and store initial contract
      await this.contractRepository.setContract(
        new Contract().setHostName(hostName).setConsent(header.consent)
      )

      console.log('header intercepted and modified: ', header.toString())
    }
    return header
  }

  /**
   * Evaluate a header and respectively
   * A) prepare a counter offer for the website
   * or B) prepare a contract proposal for the user
   * @param {*} header
   * @returns Header | Proposal | Contract
   */
  async onHeadersReceived (header, hostName) {
    let result = null

    console.log('2 switch status ', header.status)
    switch (header.status) {
      case NegotiationStatus.EXCHANGE:
        result = await this.negotiator.prepareCounteroffer(header, hostName)
        break
      case NegotiationStatus.NEGOTIATION:
        {
          const couldBeAttractive =
            await this.negotiator.couldBeAttractiveForUser(header, hostName)
          if (couldBeAttractive) {
            // UI: present to user
            result = new Proposal()
              .setHostName(hostName)
              .setCost(header.cost)
              .setConsent(header.consent)
              .setContent(header.content)
              .setUserHasAccepted(false)
          } else {
            // calculate counter offer
            result = await this.negotiator.prepareCounteroffer(
              header,
              hostName
            )
          }
        }
        break
      case NegotiationStatus.ACCEPTED:
        {
          const proposal = await this.proposalRepository.getProposal(hostName)
          if (proposal?.userHasAccepted) {
            // TODO: delete proposal
            result = new Contract()
              .setHostName(hostName)
              .setCost(header.cost)
              .setConsent(header.consent)
              .setContent(header.content)
          } else {
            // ELSE propose contract to user
            result = new Proposal()
              .setHostName(hostName)
              .setCost(header.cost)
              .setConsent(header.consent)
              .setContent(header.content)
              .setUserHasAccepted(false)
          }
        }
        break
      default:
        break
    }

    return result
  }
}
