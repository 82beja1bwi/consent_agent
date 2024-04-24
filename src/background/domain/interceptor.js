import Contract from './models/contract.js'
import Header, { NegotiationStatus } from './models/header.js'
import Proposal from './models/proposal.js'

import Negotiator from './negotiator.js'
import ContractRepository from '../storage/contracts_repository.js'
import ProposalRepository from '../storage/proposalRepository.js'
import PreferenceManager from './preference_manager.js'

export default class Interceptor {
  /**
   *
   * @param {ContractRepository} contractRepository
   * @param {ProposalRepository} proposalRepository
   * @param {Negotiator} negotiator
   * @param {PreferenceManager} preferenceManager
   */
  constructor (contractRepository, proposalRepository, negotiator, preferenceManager) {
    this.contractRepository = contractRepository
    this.proposalRepository = proposalRepository
    this.preferenceManager = preferenceManager
    this.negotiator = negotiator
  }

  handleGetData (hostname) {
    const proposal = this.proposalRepository.getProposal(hostname)
    const contract = this.contractRepository.getContract(hostname)
    const costResolutions = this.preferenceManager
      .getSitesPreferences(hostname, false)
      ?.cost.getResolutionsKeys()
    // const costPreferences = {} // [0, 2, 8, 10]
    return { proposal, contract, costResolutions }
  }

  async handleUpdatedCostPreferences (hostname, resolutions) {
    const prefs = this.preferenceManager.createUsers3CPreferences(
      hostname,
      resolutions
    )

    return new Header()
      .setStatus(NegotiationStatus.EXCHANGE)
      .setPreferences(prefs)
  }

  async handleAcceptedProposal (hostname, proposal) {
    const contract = new Contract()
      .setHostName(hostname)
      .setConsent(proposal.consent)
      .setContent(proposal.content)
      .setCost(proposal.cost)
    this.contractRepository.setContract(contract)
    this.proposalRepository.deleteProposal(proposal.hostName)
    // TODO notify domain
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
        result = this.negotiator.prepareCounteroffer(
          header,
          hostName
        )
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
      // TODO IF hasUserAlreadyAccepted?
        if (this.proposalRepository.getProposal(hostName)?.userHasAccepted) {
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

        break
      default:
        break
    }

    return result
  }
}
