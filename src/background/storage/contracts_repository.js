import Contract from '../domain/models/contract.js'

export default class ContractRepository {
  constructor () {
    this.contracts = new Map()
  }

  getContract (hostname) {
    return Contract.fromData(this.contracts.get(hostname)) || null
  }

  setContract (contract) {
    if (contract instanceof Contract) {
      this.contracts.set(contract.hostName, contract)
    }
  }
}
