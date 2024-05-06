// eslint-disable-next-line no-unused-vars
import ProposalRepository from './storage/proposalRepository.js'
import { getHostname } from '../utils/util.js'

/**
 * Manages the text on the badge.
 * E.g., if a proposal exists for a site, the text should be 1, else 0
 */
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

  /**
   * if, on any change in the proposal repository,
   * the current badge text should be updated, then update it
   */
  #handleProposalsUpdates = () => {
    this.proposalRepository.proposals$.subscribe({
      next: async (proposals) => {
        if (proposals) {
          const hostname = await getHostname()
          this.#setBadgeText(proposals[hostname])
        }
      }
    })
  }

  #handleNewSiteInTab = () => {
    /**
     * Inside a tab a new site is loaded or current one is updated
     * CASE: user opens new tab, then opens gmail
     */
    // eslint-disable-next-line no-undef
    browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tabInfo) => {
      const hostname = new URL(tabInfo.url).hostname
      await this.#fromHostnameToBadgeText(hostname)
    })
  }

  #handleAnotherTabSelected = () => {
    /**
     * Another, already opened or new, tab
     * CASE: user has opened gmail in another tab, clicks on the tab
     */
    // eslint-disable-next-line no-undef
    browser.tabs.onActivated.addListener(async (activeInfo) => {
      const hostname = await getHostname()
      await this.#fromHostnameToBadgeText(hostname)
    })
  }

  #fromHostnameToBadgeText = async (hostname) => {
    const proposal = await this.#getProposal(hostname)
    this.#setBadgeText(proposal)
  }

  #getProposal = async (hostName) => {
    return await this.proposalRepository.getProposal(hostName)
  }

  /**
   * helper function that actually sets the text of the batch
   * @param {String} hostName
   */
  #setBadgeText = (proposal) => {
    const text = proposal && !proposal.userHasAccepted ? '1' : ''
    // eslint-disable-next-line no-undef
    browser.browserAction.setBadgeText({ text })
  }
}
