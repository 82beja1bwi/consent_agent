import Contract from './domain/models/contract.js'
import Header, { NegotiationStatus } from './domain/models/header.js'
import ContractRepository from './storage/contracts_repository.js'
import Negotiator from './domain/negotiator.js'
import Calculator from './domain/calculator.js'
import PreferenceManager from './domain/preference_manager.js'
import PreferencesRepository from './storage/preferences_repository.js'

const negotiator = new Negotiator(new Calculator())
const contractRepository = new ContractRepository()
const preferenceManager = new PreferenceManager(new PreferencesRepository())

/**
 * helper method
 * instead of www.google.com/.../... return google.com
 * @returns base url of domain
 */
async function getDomainURL () {
  // eslint-disable-next-line no-undef
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  const currentTab = tabs[0]
  const currentUrl = new URL(currentTab.url)
  return currentUrl.hostname
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
      const hostName = await getDomainURL()
      const contract = contractRepository.getContract(hostName)

      if (!contract) {
        console.log('No contract found for host:', hostName)
        // Construct initial header
        const header = negotiator.prepareInitialOffer()

        // Set up and store initial contract
        contractRepository.setContract(
          hostName,
          new Contract(hostName, header.consent, null, null)
        )
        // init the users preferences
        header.preferences = preferenceManager.initUsersPreferences(hostName)

        details.requestHeaders.push({
          name: 'ADPC',
          value: header.toString()
        })
        console.log('header intercepted and modified: ', header.toString())
      } else {
        console.log('Contract found:', contract)
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
