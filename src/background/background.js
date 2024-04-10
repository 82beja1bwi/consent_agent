import Header from './domain/models/header.js'
import ContractRepository from './storage/contracts_repository.js' // default singleton
import Negotiator from './domain/negotiator.js'
import Calculator from './domain/calculator.js'
import PreferenceManager from './domain/preference_manager.js'
import Proposal from './domain/models/proposal.js'
import ProposalRepository from './storage/proposalRepository.js' // default singleton
import { getHostname } from './util.js'
import BadgeTextManager from './badgeTextManager.js'
import Interceptor from './domain/interceptor.js'

// Dependency Injection
const negotiator = new Negotiator(new Calculator(), new PreferenceManager())
const contractRepository = new ContractRepository()
const proposalRepository = new ProposalRepository()
const intereceptor = new Interceptor(contractRepository, proposalRepository, negotiator)
const badgeTextManager = new BadgeTextManager(proposalRepository)
badgeTextManager.registerListeners()

// TODO remove this test code
await proposalRepository.setProposal(new Proposal('host1', null, 0, 0))

await proposalRepository.setProposal(
  new Proposal('mail.google.com', null, 1, 2)
)

/**
 * TODO:
 * on first install initiate databases etc.
 */
// eslint-disable-next-line no-undef
browser.runtime.onInstalled.addListener(function (details) {
  if (details.reason === 'install') {
    // Perform database initialization tasks
    // initializeDatabase();
  }
})

// Event listener for intercepting HTTP requests
// eslint-disable-next-line no-undef
browser.webRequest.onBeforeSendHeaders.addListener(

  async function (details) {
    try {
      const hostname = await getHostname()
      if (!hostname) return // when only search is open, the tab has no URL

      const header = await intereceptor.onBeforeSendHeaders(hostname)
      if (header) {
        details.requestHeaders.push({
          name: 'ADPC',
          value: header.toString()
        })
        console.log('header modified')
      }

      // Continue any request to its receiver
      return { requestHeaders: details.requestHeaders }
    } catch (error) {
      console.error('An error occurred:', error)
      console.error('Stack trace:', error.stack)
      throw error // Re-throw the error to propagate it further
    }
  },
  { urls: ['<all_urls>'] }, // Intercept all URLs
  ['blocking', 'requestHeaders']
)

/**
 * intercepts responses from the site.
 * Only responses containing an ADPC @param {Header} header will be handled.
 * Will A) return an http-request to the server or B) show a batch to the user.
 *
 */
// eslint-disable-next-line no-undef
browser.webRequest.onHeadersReceived.addListener(
  async function (details) {
    // Check if the request was successful
    if (details.statusCode === 200) {
      // Access the response headers
      const responseHeaders = details.responseHeaders
      const headerString = responseHeaders.find(
        (header) => header.name.toLowerCase() === 'ADPC'
      )
      if (headerString) {
        const header = Header.fromString(headerString.value)
        console.log('Parsed Header ', header)

        const result = intereceptor.onHeadersReceived(header)

        // Send response to server or show batch to user
        if (result instanceof Header) {
          // Send new proposal to server
          const headers = {
            ADPC: result.toString()
          }
          const url = new URL(details.url, details.originUrl)
          fetch(url, { headers })
        } else {
          // Update badge in UI to notify the user on a new contract or contract proposal
          browser.browserAction.setBadgeText(
            { text: '1' } // object
          )
        }
      }
    }
  },
  { urls: ['<all_urls>'] }, // Intercept all URLs
  ['responseHeaders']
)
