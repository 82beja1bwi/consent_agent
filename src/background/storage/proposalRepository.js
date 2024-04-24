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

  #init = async () => {
    const res = await browser.storage.local.get('proposals')
    this.proposals = res.proposals
    browser.storage.local.onChanged.addListener((changes, area) => {
      const changedItems = Object.keys(changes)

      for (const item of changedItems) {
        this.proposals = changes[item].newValue.proposals
        this.proposals$.next(this.proposals)
      }
    })
  }

  /**
   *
   * @param {*} hostName
   * @returns {Proposal | null}
   */
  getProposal (hostName) {
    return this.proposals[hostName]
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
    console.log('CALLED SET PROP', proposal)
    this.proposals[proposal.hostName] = proposal
    await browser.storage.local.set({ proposals: this.proposals })
  }
}
