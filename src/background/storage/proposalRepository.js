// eslint-disable-next-line no-unused-vars
import Proposal from '../domain/models/proposal.js'
import { BehaviorSubject } from 'rxjs'

export default class ProposalRepository {
  constructor () {
    this.proposals = {}
    // a multi-cast stream of changes made to stored proposals
    this.proposals$ = new BehaviorSubject(this.proposals)
    this.#init()
  }

  #init = () => {
    browser.storage.local.onChanged.addListener((changes, area) => {
      console.log(`Change in storage area: ${area}`)

      const changedItems = Object.keys(changes)

      for (const item of changedItems) {
        console.log(`${item} has changed:`)
        console.log('New value: ', changes[item].newValue)
        this.proposals = changes[item].newValue
        this.proposals$.next(this.proposals)
        console.log('updated proposals stream:', this.proposals$)
      }
    })
  }

  /**
   *
   * @param {*} hostName
   * @returns {Proposal | null}
   */
  getProposal (hostName) {
    return this.proposals[hostName] || null
  }

  async deleteProposal (hostName) {
    delete this.proposals[hostName]
    await browser.storage.local.set({ proposals: this.proposals })
  }

  /**
   *
   * @param {Proposal} proposal
   */
  async setProposal (proposal) {
    console.log('set')
    this.proposals[proposal.hostName] = proposal
    await browser.storage.local.set({ proposals: this.proposals })
  }
}
