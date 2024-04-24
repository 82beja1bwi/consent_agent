import { MessageActions } from '../background/background.js'
import Consent from '../background/domain/models/consent.js'
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

// const proposal = response.proposal
// const contract = response.contract
// const costResolutions = response.costResolutions

const proposal = null
const contract = new Contract()
  .setConsent(new Consent())
  .setContent(80)
  .setCost(null)
const costResolutions = [0, 2, 5, 9]

console.log('proposal: ', proposal)
console.log('contract: ', contract)
console.log('cost prefs: ', costResolutions)

if (proposal) {
  initButton(true, 'Accept', function () {
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
  (!contract.cost || contract.cost === 0) &&
  contract.consent.isRejectAll()
) {
  console.log('should show sliders')
  initButton(true, 'Send', function () {
    const resolutions = {}
    const sliders = document.querySelectorAll('.grade-slider')
    sliders.forEach((slider) => {
      resolutions[slider.id] = slider.value
    })
    console.log('Selected values:', resolutions)
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
  button.style.display = isActive ? 'block' : 'none'
  button.textContent = text

  document.getElementById('button').addEventListener('click', () => callback())
}

function populateContract (cost, consent, content) {
  populateData(false, cost, consent, content)
}
function populateProposal (cost, consent, content) {
  populateData(true, cost, consent, content)
}

function populateData (isProposal, cost, consent, content) {
  let consentString
  if (consent) {
    consentString = Consent.fromObject(consent).toString()
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
  // Generate option rows
  const optionsContainer = document.getElementById('optionsContainer')
  costResolutions.forEach((resolution) => {
    const optionRow = document.createElement('div')
    optionRow.classList.add('option-row')
    optionRow.innerHTML = `
        <label class="option-label" for="${resolution}">${resolution}:</label>
        <div class="grade-slider-container">
          <span class="grade-value" id="${resolution}Value">6</span>
          <input type="range" class="grade-slider" id="${resolution}" min="1" max="6" value="6" step="1">
        </div>
      `
    optionsContainer.appendChild(optionRow)
  })

  // Add event listeners for sliders
  const sliders = document.querySelectorAll('.grade-slider')
  sliders.forEach((slider) => {
    const valueSpan = slider.previousElementSibling
    valueSpan.textContent = slider.value // Set initial value
    slider.addEventListener('input', () => {
      valueSpan.textContent = slider.value
    })
  })
}
