import { getHostname } from '../util.js'
import Contract from './models/contract.js'
import { NegotiationStatus } from './models/header.js'
import Proposal from './models/proposal.js'

export default class Interceptor {
  constructor (contractRepository, proposalRepository, negotiator) {
    this.contractRepository = contractRepository
    this.proposalRepository = proposalRepository
    this.negotiator = negotiator
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
 * @returns {Header | Proposal}
 */
  async onHeadersReceived (header) {
    const hostName = await getHostname()

    let counterOfferHeader = null
    // TODO ggf in datenmodell des UI folders auslagern
    const proposal = null

    switch (header.status) {
      case NegotiationStatus.EXCHANGE:
        counterOfferHeader = this.negotiator.prepareCounteroffer(
          header,
          hostName
        )
        break
      case NegotiationStatus.NEGOTIATION:
        if (this.negotiator.couldBeAttractiveForUser(header, hostName)) {
          // UI: present to user
          this.proposalRepository.setProposal(
            new Proposal()
              .setHostName(header.hostName)
              .setCost(header.cost)
              .setConsent(header.consent)
              .setContent(header.content)
              .setUserHasAccepted(false)
          )
        } else {
          // calculate counter offer
          counterOfferHeader = this.negotiator.prepareCounteroffer(
            header,
            hostName
          )
        }
        break
      case NegotiationStatus.ACCEPTED:
      // TODO IF hasUserAlreadyAccepted?
        if (this.proposalRepository.getProposal(hostName)?.userHasAccepted) {
          // TODO: delete proposal
          this.proposalRepository.deleteProposal(hostName)
          this.contractRepository.setContract(
            new Contract()
              .setHostName(header.hostName)
              .setCost(header.cost)
              .setConsent(header.consent)
              .setContent(header.content)
          )
        } else {
          // ELSE propose contract to user
          this.proposalRepository.setProposal(
            new Proposal()
              .setHostName(header.hostName)
              .setCost(header.cost)
              .setConsent(header.consent)
              .setContent(header.content)
              .setUserHasAccepted(false)
          )
        }

        break
      default:
        break
    }

    return counterOfferHeader || proposal
  }
}
