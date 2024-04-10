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
    browser.storage.local.onChanged.addListener((changes) => {
      if (changes.proposals) {
        this.proposals = changes.proposals
        this.proposals$.next(changes.proposals)
        console.log('modified proposals:', this.proposals$)
      }
    })
  }

  /**
   *
   * @param {*} hostName
   * @returns {Proposal | null}
   */
  getProposal (hostName) {
    console.log(this.proposals$)
    return this.proposals[hostName] || null
  }

  deleteProposal (hostName) {
    delete this.proposals[hostName]
  }

  /**
   *
   * @param {Proposal} proposal
   */
  async setProposal (proposal) {
    console.log('set')
    this.proposals[proposal.hostName] = proposal
    await browser.storage.local.set(this.proposals)
  }
}
