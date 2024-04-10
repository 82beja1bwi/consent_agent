// eslint-disable-next-line no-unused-vars
import ProposalRepository from './storage/proposalRepository.js'
import { getHostname } from './util.js'

export default class BadgeTextManager {
  /**
   *
   * @param {ProposalRepository} proposalRepository
   */
  constructor (proposalRepository) {
    this.proposalRepository = proposalRepository
  }

  registerListeners = () => {
    this.#handleProposalsUpdates()
    this.#handleNewSiteInTab()
    this.#handleAnotherTabSelected()
  }

  #handleProposalsUpdates = () => {
    this.proposalRepository.proposals$.subscribe({
      next: async (proposals) => {
        const hostname = await getHostname()
        if (
          hostname &&
          Object.prototype.hasOwnProperty.call(proposals, hostname)
        ) {
          this.#setBadgeText(hostname)
        }
      }
    })
  }

  #handleNewSiteInTab = () => {
  /**
     * Inside a tab a new site is loaded or current one is updated
     * CASE: user opens new tab, then opens gmail
     */
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
      const hostname = new URL(tabInfo.url).hostname
      this.#setBadgeText(hostname)
    })
  }

  #handleAnotherTabSelected = () => {
    /**
       * Another, already opened or new, tab
       * CASE: user has opened gmail in another tab, clicks on the tab
       */
    browser.tabs.onActivated.addListener(async (activeInfo) => {
      const hostname = await getHostname()
      // in this case it can actually be null
      this.#setBadgeText(hostname)
    })
  }

  /**
 * helper function that actually sets the text of the batch
 * @param {String} hostName
 */
  #setBadgeText = (hostName) => {
    const proposal = this.proposalRepository.getProposal(hostName)
    const text = proposal ? '1' : ''
    browser.browserAction.setBadgeText({ text })
  }
}
