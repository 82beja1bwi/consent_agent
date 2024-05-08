import { MessageActions } from '../background/background.js'
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

// console.log(response)

const proposals = response.proposals?.map((proposal) => (Proposal.fromData(proposal)))
const contract = Contract.fromData(response.contract)
const costResolutions = response.costResolutions

// const proposals = [
//   new Proposal(
//     'localhost',
//     new Consent()
//       .setAnalytics(true)
//       .setMarketing(true)
//       .setExternalContent(true),
//     0,
//     80,
//     false
//   ),
//   new Proposal(
//     'localhost',
//     new Consent().setPersonalizedAds(true),
//     0,
//     70,
//     false
//   ),
//   new Proposal(
//     'localhost',
//     new Consent().setAnalytics(true).setPersonalizedAds(true),
//     0,
//     90,
//     false
//   )
// ]

// const contract = null
// // new Contract()
// //   .setConsent(new Consent().setAnalytics(true).setMarketing(true).setExternalContent(true).setIdentification(true).setPersonalizedAds(true))
// //   .setContent(80)
// // .setCost(0)
// const costResolutions = null // [0, 2, 5, 9]

console.log('proposal: ', proposals)
console.log('contract: ', contract)
console.log('cost prefs: ', costResolutions)

if (proposals) {
  document.getElementById('description').textContent = 'PROPOSALS'
  const proposalsContainer = document.getElementById('contractContainer')

  proposals.forEach((proposal) => {
    const btnCallback = function () {
      console.log('POPUP: slected proposal: ', proposal, ' ', hostname)
      browser.runtime.sendMessage({
        action: MessageActions.PROPOSAL_ACCEPTED,
        proposal,
        hostname
      })
      window.close()
    }
    const proposalElement = createThreeCHtml(proposal, btnCallback)
    proposalsContainer.appendChild(proposalElement)
  })
} else if (
  costResolutions &&
  (!contract.cost || contract.cost === 0)
  // &&  contract.consent.isRejectAll()
) {
  document.getElementById('description').textContent = 'CURRENT CONTRACT'
  const parent = document.getElementById('contractContainer')
  const contractElement = createThreeCHtml(contract, null)
  parent.append(contractElement)

  populateCostPreferenceSelection(costResolutions)
} else {
  document.getElementById('description').textContent = 'CURRENT CONTRACT'
  const parent = document.getElementById('contractContainer')

  const contractElement = createThreeCHtml(contract, null)
  parent.append(contractElement)
}

function createThreeCHtml (proposalOrContract, btnCallback) {
  const proposalDiv = document.createElement('div')
  proposalDiv.classList.add('bottomPaddedContainer')

  const table = document.createElement('table')

  const threeCs = ['Cost', 'Consent', 'Content']
  for (const c of threeCs) {
    const row = document.createElement('tr')
    const label = document.createElement('td')
    label.textContent = c
    const resolution = document.createElement('td')
    let text = ''
    if (c === 'Cost') {
      text = proposalOrContract.cost ?? 0
    } else if (c === 'Consent') {
      const consentString = proposalOrContract.consent.isRejectAll()
        ? 'rejected'
        : proposalOrContract.consent.toString()

      text = consentString
    } else {
      text = proposalOrContract.content ?? 100
    }
    resolution.textContent = text
    row.appendChild(label)
    row.appendChild(resolution)
    table.appendChild(row)
  }

  if (proposalOrContract.score) {
    const row = document.createElement('tr')
    const label = document.createElement('td')
    label.textContent = 'Score' // Assign text content to label
    const resolution = document.createElement('td')
    resolution.textContent = proposalOrContract.score // Assign text content to resolution

    row.appendChild(label)
    row.appendChild(resolution)
    table.appendChild(row)
  }

  proposalDiv.appendChild(table)

  if (btnCallback) {
    const acceptButton = document.createElement('button')
    acceptButton.textContent = 'ACCEPT'
    acceptButton.style.display = 'block'
    acceptButton.addEventListener('click', btnCallback)

    proposalDiv.appendChild(acceptButton)
  }

  return proposalDiv
}

function initButton (isActive, text, callback) {
  const button = document.getElementById('button')
  button.hidden = false
  button.style.display = isActive ? 'block' : 'none'
  button.textContent = text

  document.getElementById('button').addEventListener('click', () => callback())
}

function populateContract (contract) {
  document.getElementById('description').textContent = 'CURRENT CONTRACT'

  createThreeCHtml(contract, null)

  // document.getElementById('cost').textContent = contract.cost ?? 0
  // document.getElementById('consent').textContent = contract.consent
  // document.getElementById('content').textContent = contract.content ?? 0

  // Show or hide the accept button based on the proposal
  // const acceptButton = document.getElementById('button')
  // acceptButton.style.display = isProposal ? 'block' : 'none'
}

function populateCostPreferenceSelection (costResolutions) {
  const preferencesParent = document.getElementById('preferencesParent')
  preferencesParent.hidden = false

  const preferencesContainer = document.getElementById('preferencesContainer')

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

  const sendButton = document.createElement('button')
  sendButton.textContent = 'SEND'
  sendButton.style.display = 'block' // Set display property to block
  sendButton.addEventListener('click', () => {
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

  preferencesContainer.appendChild(sendButton)
}
