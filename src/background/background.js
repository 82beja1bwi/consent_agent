import Contract from './domain/models/contract.js'
import Consent from './domain/models/consent.js'
import Header, { NegotiationStatus } from './domain/models/header.js'
import { getContract, setContract } from './storage/contracts_repository.js'

async function getDomainURL () {
  // eslint-disable-next-line no-undef
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  const currentTab = tabs[0]
  const currentUrl = new URL(currentTab.url)
  const domainURL = currentUrl.origin
  return domainURL
}

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
      // IF no agreement exists, THEN should start negotiation
      // consequence: user clicks around in domain and negotiation will only be started once
      const domainURL = await getDomainURL()
      console.log('Domain URL:', domainURL)
      const contract = getContract(domainURL)
      const contractExists = contract != null
      if (!contractExists) {
        console.log('No contract found for domain URL:', domainURL)
        // TODO: Praeferenzen laden
        //
        // Contract is initiated
        setContract(domainURL, new Contract(domainURL, new Consent(false, false, false, false, false, false), 0, 100))
        console.log('Initiated contract')
        // TODO: construct initial header
        details.requestHeaders.push({
          name: 'X-Custom-Header',
          value: 'HelloImTheClientsAgent'
        })
        console.log('header intercepted and modified')
      } else {
        console.log('Contract found:', contract)
      }

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
 * Will A) return an http-request to the server or B) show a pop-in to the user.
 *
 */
// eslint-disable-next-line no-undef
browser.webRequest.onHeadersReceived.addListener(
  function (details) {
    // Check if the request was successful
    if (details.statusCode === 200) {
      // Access the response headers
      const responseHeaders = details.responseHeaders
      const header = responseHeaders.find(header => header.name.toLowerCase() === 'ADPC')
      if (header) {
        const parsedHeader = Header.fromString(header.value)
        console.log('Parsed Header ', parsedHeader)

        switch (parsedHeader.status) {
          case NegotiationStatus.EXCHANGE:
            // calculate first offer
            break
          case NegotiationStatus.NEGOTIATION:
            // isAttractive?
            //   propose to user
            // else
            //   calculate counter offer similarly to first offer
            break
          case NegotiationStatus.ACCEPTED:
            // hasUserAlreadyAccepted?
            //   Congrats, inform user on new contract
            // else
            //   propose contract to user
            break
          default:
            break
        }

        // SEND RESPONSE      VS    POP-IN

        // Send the new HTTP request
        /* const headers = {
                    'X-New-Header': 'Your-Value'
                };
                const url = new URL(details.url, details.originUrl);
                console.log("Request URL:", url.href);
                fetch(url, { headers }); */
      }
    }
  },
  { urls: ['<all_urls>'] }, // Intercept all URLs
  ['responseHeaders']
)
