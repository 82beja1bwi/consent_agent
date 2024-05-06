// eslint-disable-next-line no-unused-vars
import Proposal from '../domain/models/proposal.js'
import { BehaviorSubject } from 'rxjs'

export default class ProposalRepository {
  constructor () {
    if (ProposalRepository.instance) {
      return ProposalRepository.instance
    }
    ProposalRepository.instance = this
    // a multi-cast stream of changes made to stored proposals
    this.proposals$ = new BehaviorSubject(this.proposals)
    this.#init()
  }

  #init = async () => {
    browser.storage.local.onChanged.addListener((changes, area) => {
      const changedItems = Object.keys(changes)
      if (changedItems.includes('proposals')) {
        // console.log('UPDATE STREAM', changes.proposals.newValue)
        this.proposals$.next(changes.proposals.newValue)
      }
    })
  }

  /**
   *
   * @param {String} hostName
   */
  async getProposal (hostName) {
    const storageData = await browser.storage.local.get('proposals')
    const proposals = storageData.proposals || {} // If proposals object doesn't exist, initialize it as an empty object

    return Proposal.fromData(proposals[hostName]) || null
  }

  async deleteProposal (hostName) {
    // Retrieve the proposals object from local storage
    const storageData = await browser.storage.local.get('proposals')
    const proposals = storageData.proposals || {} // If proposals object doesn't exist, initialize it as an empty object

    // Check if the proposal exists
    if (proposals.hasOwnProperty(hostName)) {
      // Delete the proposal with the specified hostName
      delete proposals[hostName]

      // Save the updated proposals object back to local storage
      await browser.storage.local.set({ proposals })
    }
  }

  /**
   *
   * @param {Proposal} proposal
   */
  async setProposal (proposal) {
    const storageData = await browser.storage.local.get('proposals')
    const proposals = storageData.proposals || {} // If proposals object doesn't exist, initialize it as an empty object

    proposals[proposal.hostName] = proposal

    await browser.storage.local.set({ proposals })
  }
}
