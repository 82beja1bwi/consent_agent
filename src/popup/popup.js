import { MessageActions } from '../background/background.js'
import Consent from '../background/domain/models/consent.js'
import Proposal from '../background/domain/models/proposal.js'

import Contract from '../background/domain/models/contract.js'
import { getHostname } from '../utils/util.js'

// function handleResponse (response) {
//   console.log(`Message from the background script: ${response}`)
// }

/* function handleError (error) {
  console.log(`Error: ${error}`)
} */

const hostname = await getHostname()
const response = await browser.runtime.sendMessage({
  action: MessageActions.GET_DATA,
  hostname
})

console.log(response)

const proposal = Proposal.fromData(response.proposal)
const contract = Contract.fromData(response.contract)
const costResolutions = response.costResolutions

// const proposal = null
// const contract = new Contract()
//   .setConsent(new Consent().setAnalytics(true).setMarketing(true).setExternalContent(true).setIdentification(true).setPersonalizedAds(true))
//   .setContent(80)
//   .setCost(null)
// const costResolutions = [0, 2, 5, 9]

console.log('proposal: ', proposal)
console.log('contract: ', contract)
console.log('cost prefs: ', costResolutions)

if (proposal) {
  initButton(true, 'ACCEPT', function () {
    browser.runtime.sendMessage({
      action: MessageActions.PROPOSAL_ACCEPTED,
      proposal,
      hostname
    })
    window.close()
  })
  populateProposal(proposal.cost, proposal.consent, proposal.content)
} else if (
  costResolutions &&
  (!contract.cost || contract.cost === 0)
  // &&  contract.consent.isRejectAll()
) {
  initButton(true, 'SEND', function () {
    const resolutions = {}
    const sliders = document.querySelectorAll('input[type="range"]')
    sliders.forEach((slider) => {
      resolutions[slider.id] = slider.value
    })
    browser.runtime.sendMessage({
      action: MessageActions.COST_PREFERENCES_RECEIVED,
      resolutions,
      hostname
    })
    window.close()
  })
  populateContract(contract.cost, contract.consent, contract.content)
  populateCostPreferenceSelection(costResolutions)
} else {
  populateContract(contract.cost, contract.consent, contract.content)
}

function initButton (isActive, text, callback) {
  const button = document.getElementById('button')
  button.hidden = false
  button.style.display = isActive ? 'block' : 'none'
  button.textContent = text

  document.getElementById('button').addEventListener('click', () => callback())
}

function populateContract (cost, consent, content) {
  if (consent.isRejectAll()) {
    consent = 'rejected all'
  }
  populateData(false, cost || 0, consent, content || 'unknown')
}
function populateProposal (cost, consent, content) {
  populateData(true, cost, consent, content)
}

function populateData (isProposal, cost, consent, content) {
  let consentString
  if (consent) {
    consentString = consent.toString()
  }
  document.getElementById('description').textContent = isProposal
    ? 'New Proposal'
    : 'Current Contract'
  document.getElementById('cost').textContent = cost ?? 0
  document.getElementById('consent').textContent = consentString ?? ''
  document.getElementById('content').textContent = content ?? 0

  // Show or hide the accept button based on the proposal
  // const acceptButton = document.getElementById('button')
  // acceptButton.style.display = isProposal ? 'block' : 'none'
}

function populateCostPreferenceSelection (costResolutions) {
  const preferencesContainer = document.getElementById('preferencesContainer')
  preferencesContainer.hidden = false
  const header = document.createElement('h4')
  // Append the text node to the strong element
  header.appendChild(document.createTextNode('Cost Preferences'))
  preferencesContainer.appendChild(header)

  // Create and configure the subtitle title
  /* const subtitle = document.createElement('h3')
  subtitle.textContent = 'Cost Preferences'

  const explanation = document.createElement('p')
  explanation.textContent = 'How much would you be willing to pay for this site? Please assign each cost resolution (in Euro) a school grade (1 is best, 6 is worst)'

  // Insert the subtitle title before the options container
  optionsContainer.appendChild(subtitle)
  optionsContainer.appendChild(explanation) */

  const table = document.createElement('table')
  const tableHead = document.createElement('thead')
  const tableRow = document.createElement('tr')
  const priceHeader = document.createElement('th')
  priceHeader.textContent = '€'
  const attractivenessHeader = document.createElement('th')
  attractivenessHeader.textContent = 'Attractiveness'
  tableRow.appendChild(priceHeader)
  tableRow.appendChild(attractivenessHeader)
  tableHead.appendChild(tableRow)
  table.appendChild(tableHead)
  const tableBody = document.createElement('tbody')

  costResolutions.forEach((resolution, i) => {
    const newRow = document.createElement('tr')

    const priceCell = document.createElement('td')
    priceCell.textContent = resolution
    newRow.appendChild(priceCell)

    const attractivenessCell = document.createElement('td')
    const container = document.createElement('div')
    container.classList.add('grade-slider-container')

    const hintTextLowest = document.createElement('span')
    hintTextLowest.textContent = 'low'
    container.appendChild(hintTextLowest)

    const rangeInput = document.createElement('input')
    rangeInput.type = 'range'
    rangeInput.id = costResolutions[i]
    rangeInput.min = 1
    rangeInput.max = 6
    rangeInput.value = 0
    rangeInput.step = 1
    container.appendChild(rangeInput)

    const hintTextHighest = document.createElement('span')
    hintTextHighest.textContent = 'high'
    container.appendChild(hintTextHighest)

    attractivenessCell.appendChild(container)
    newRow.appendChild(attractivenessCell)

    tableBody.appendChild(newRow)
  })

  table.appendChild(tableBody)
  // document.body.appendChild(table);

  preferencesContainer.appendChild(table)
}
