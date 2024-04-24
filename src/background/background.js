import Header, { NegotiationStatus } from './domain/models/header.js'
import Contract from './domain/models/contract.js'
import { getHostname, getURL } from '../utils/util.js'
import { proposalRepository, badgeTextManager, interceptor, contractRepository } from './init_dependencies.js'
import Proposal from './domain/models/proposal.js'

export const MessageActions = {
  PROPOSAL_ACCEPTED: 1,
  GET_DATA: 2,
  COST_PREFERENCES_RECEIVED: 3
  // Add more message actions as needed
}

badgeTextManager.registerListeners()

// TODO remove this test code
// proposalRepository.setProposal(new Proposal('mail.google.com', null, 1, 0))
// //)

// contractRepository.setContract(new Contract('fluttercon.dev', new Consent().setAnalytics(true).setExternalContent(true)))

// TODO wrap into separate class called e.g., messagehandler
function handleMessage (request, sender, sendResponse) {
  let response = {}
  const hostname = request.hostname

  switch (request.action) {
    case MessageActions.PROPOSAL_ACCEPTED:
      interceptor.handleAcceptedProposal(hostname, request.proposal)
      break
    case MessageActions.GET_DATA:
      response = interceptor.handleGetData()
      break
    case MessageActions.COST_PREFERENCES_RECEIVED:
      { const header = interceptor.handleUpdatedCostPreferences(hostname, request.resolutinos)
        const headers = {
          ADPC: header.toString()
        }
        getURL().then((url) => {
          console.log('now fetching URL') // const url = new URL(details.url, details.originUrl)
          fetch(url, { headers })
        })
      }

      break
    default:
      break
  }
  sendResponse(response)
}

browser.runtime.onMessage.addListener(handleMessage)

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

      const header = await interceptor.onBeforeSendHeaders(hostname)
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

        const hostName = await getHostname()
        const result = interceptor.onHeadersReceived(header, hostName)

        switch (result.constructor) {
          case Header:{
            // Send counter/new proposal to server
            const headers = {
              ADPC: result.toString()
            }
            const url = new URL(details.url, details.originUrl)
            fetch(url, { headers })
          }
            break
          case Proposal:
            this.proposalRepository.setProposal(result)
            break
          case Contract:
            this.proposalRepository.deleteProposal(hostName)
            this.contractRepository.setContract(result)
            break
          default:
            break
        }
      }
    }
  },
  { urls: ['<all_urls>'] }, // Intercept all URLs
  ['responseHeaders']
)
