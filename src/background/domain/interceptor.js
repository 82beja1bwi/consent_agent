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
    const contract = this.contractRepository.getContract(hostname)
    const costResolutions = this.preferenceManager
      .getSitesPreferences(hostname, false)
      ?.cost.getResolutionsKeys()
    // const costPreferences = {} // [0, 2, 8, 10]
    return { proposal, contract, costResolutions }
  }

  handleUpdatedCostPreferences (hostname, resolutions) {
    // resolutions from likert points to decimals
    // from {analytics: 1, marketing: 6,...}
    // to {analytics: 0.5, marketing 0.1, ...}

    const points = Object.values(resolutions)

    // Calculate the total sum of grades
    const totalGrades = points.reduce((sum, grade) => sum + parseInt(grade), 0)

    // Calculate the percentage for each option
    const keys = Object.keys(resolutions)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      resolutions[key] = points[i] / totalGrades
    }

    const prefs = this.preferenceManager.createUsers3CPreferences(
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
   * @returns {Header} header containing an initial contract proposal
   */
  async onBeforeSendHeaders (hostName) {
    let header = null

    const contract = this.contractRepository.getContract(hostName)

    if (!contract) {
      console.log('No contract found for host:', hostName)
      // Construct initial header
      this.preferenceManager.initUsersPreferences(hostName)

      header = this.negotiator.prepareInitialOffer()

      // Set up and store initial contract
      this.contractRepository.setContract(
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
   * @returns {Header | Proposal | Contract}
   */
  async onHeadersReceived (header, hostName) {
    let result = null

    switch (header.status) {
      case NegotiationStatus.EXCHANGE:
        result = this.negotiator.prepareCounteroffer(header, hostName)
        break
      case NegotiationStatus.NEGOTIATION:
        if (this.negotiator.couldBeAttractiveForUser(header, hostName)) {
          // UI: present to user
          result = new Proposal()
            .setHostName(hostName)
            .setCost(header.cost)
            .setConsent(header.consent)
            .setContent(header.content)
            .setUserHasAccepted(false)
        } else {
          // calculate counter offer
          result = this.negotiator.prepareCounteroffer(header, hostName)
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
