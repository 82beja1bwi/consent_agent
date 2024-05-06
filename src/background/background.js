import Header, { NegotiationStatus } from './domain/models/header.js'
import Contract from './domain/models/contract.js'
import { getHostname, getURL } from '../utils/util.js'
import {
  proposalRepository,
  badgeTextManager,
  interceptor,
  contractRepository
} from './init_dependencies.js'
import Proposal from './domain/models/proposal.js'

export const MessageActions = {
  PROPOSAL_ACCEPTED: 1,
  GET_DATA: 2,
  COST_PREFERENCES_RECEIVED: 3,
  IMITATE_RELOAD: 4
}

badgeTextManager.registerListeners()

// // TODO remove this test code
// await proposalRepository.setProposal(new Proposal('mail.google.com', null, 1, 0))

// await proposalRepository.setProposal(
//   new Proposal('askjdlkasjdsa.google.com', null, 1, 0)
// )

// await proposalRepository.setProposal(
//   new Proposal('lkklj.google.com', null, 1, 0)
// )

// //)

// contractRepository.setContract(new Contract('fluttercon.dev', new Consent().setAnalytics(true).setExternalContent(true)))

/**
 * handles messages as in https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#sending_an_asynchronous_response_using_sendresponse
 * @param {*} request
 * @param {*} sender
 * @param {*} sendResponse
 * @returns
 */
function handleMessage (request, sender, sendResponse) {
  // NEVER SET ASYNC OR RESPONSE WILL NOT BE RETURNED TO SENDER
  const hostname = request.hostname

  switch (request.action) {
    case MessageActions.PROPOSAL_ACCEPTED:
      // no async/await because responses would not be sent to sender
      interceptor
        .handleAcceptedProposal(hostname, request.proposal)
        .then((header) => header.toString())
        .then((headerString) =>
          getURL().then((url) => Object.assign({}, { url, headerString }))
        )
        .then(({ url, headerString }) => {
          fetch(url, { headers: { ADPC: headerString } })
        })
      break
    case MessageActions.GET_DATA:
      // no async/await because responses would not be sent to sender
      interceptor
        .handleGetData(hostname)
        .then((response) => sendResponse(response))
      break
    case MessageActions.COST_PREFERENCES_RECEIVED:
      {
        const header = interceptor.handleUpdatedCostPreferences(
          hostname,
          request.resolutions
        )
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
  // dont remove
  // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage#sending_an_asynchronous_response_using_sendresponse
  return true
}

browser.runtime.onMessage.addListener(handleMessage)

// Event listener for intercepting HTTP requests
// eslint-disable-next-line no-undef
browser.webRequest.onBeforeSendHeaders.addListener(
  async function (details) {
    try {
      console.log(details)
      if (details.type !== 'main_frame') return // ignore requests not going to the main host
      console.log('inside ', details)

      const hostname = new URL(details.url)?.hostname

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
        (header) => header.name.toLowerCase() === 'adpc'
      )
      if (headerString) {
        const header = Header.fromString(headerString.value)
        console.log('Parsed Header ', header)

        const hostName = new URL(details.url)?.hostname // await getHostname()
        const result = await interceptor.onHeadersReceived(header, hostName)

        switch (result.constructor) {
          case Header:
            {
              // Send counter/new proposal to server
              const headers = {
                ADPC: result.toString()
              }
              console.log('RES: WILL SEND HEADER:', headers)
              const url = new URL(details.url, details.originUrl)
              fetch(url, { headers })
            }
            break
          case Proposal:
            console.log('RES: SET PROPOSAL: ', result)

            await proposalRepository.setProposal(result)
            break
          case Contract:
            console.log('WILL NOW STORE CREATED CONTRACT: ', result)
            proposalRepository.deleteProposal(hostName)
            contractRepository.setContract(result)
            browser.tabs
              .query({ url: `*://${hostName}/*` })
              .then((tabs) => {
                if (tabs.length > 0) {
                  for (let i = 0; i < tabs.length; i++) {
                    const tabId = tabs[i].id
                    browser.tabs.reload(tabId)
                      .then(() => console.log('Refreshed Page'))
                      .catch((error) => console.error('Error on page refresh: ', error))
                  }
                }
              })
              .catch((error) => {
                console.error('Error querying tabs:', error)
              })
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
