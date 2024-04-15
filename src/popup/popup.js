import Consent from '../background/domain/models/consent.js'
import Contract from '../background/domain/models/contract.js'
import { getHostname } from '../utils/util.js'

/* function handleResponse (message) {
  console.log(`Message from the background script: ${message.response}`)
}

function handleError (error) {
  console.log(`Error: ${error}`)
} */

const hostname = await getHostname()
console.log(hostname)
// const proposal = proposalRepository.getProposal(hostname)
const response = await browser.runtime.sendMessage({
  saveContract: false,
  hostname
})

const proposal = response.proposal
const contract = response.contract

console.log('proposal: ', proposal)
console.log('contract: ', contract)

if (proposal) {
  populateData(true, proposal.cost, proposal.consent, proposal.content)

  document
    .getElementById('acceptButton')
    .addEventListener('click', function () {
      browser.runtime.sendMessage(
        {
          saveContract: true,
          proposal
        }
      )
      window.close()
    })
} else {
  populateData(false, contract.cost, contract.consent, contract.content)
}

function populateData (isProposal, cost, consent, content) {
  let consentString
  if (consent) {
    consentString = Consent.fromObject(consent).toString()
    console.log('CONSENT STRING, ', consentString)
  }
  document.getElementById('description').textContent = isProposal
    ? 'New Proposal'
    : 'Current Contract'
  document.getElementById('cost').textContent = cost ?? 0
  document.getElementById('consent').textContent = consentString
  document.getElementById('content').textContent = content ?? 0

  // Show or hide the accept button based on the proposal
  const acceptButton = document.getElementById('acceptButton')
  acceptButton.style.display = isProposal ? 'block' : 'none'
}
