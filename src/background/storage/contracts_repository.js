import Contract from '../domain/models/contract.js'

export default class ContractRepository {
  constructor () {
    this.contracts = {}
  }

  getContract (hostname) {
    return this.contracts[hostname] || null
  }

  setContract (contract) {
    if (contract instanceof Contract) {
      this.contracts[contract.hostName] = contract
      console.log('Contract stored for ', contract.hostName, ' ', contract)
    }
  }
}
