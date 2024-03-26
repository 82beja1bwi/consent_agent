import Contract from '../domain/models/contract.js'

const contracts = {}

export function getContract (baseURL) {
  return contracts[baseURL] || null
}

export function setContract (baseURL, contract) {
  if (contract instanceof Contract) {
    contracts[baseURL] = contract
    console.log('Contract stored for ', contract.baseURL)
  }
}
