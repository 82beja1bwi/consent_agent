import Contract from '../domain/models/contract.js'

export default class ContractRepository {
  async getContract (hostname) {
    const storageData = await browser.storage.local.get('contracts')
    console.log('CONTRACT storage data', storageData)
    const contracts = storageData.contracts || {} // If proposals object doesn't exist, initialize it as an empty object
    console.log('CONTRACTS', contracts)

    const result = Contract.fromData(contracts[hostname]) || null

    console.log('CONTRACT: ', result)

    return result
  }

  async setContract (contract) {
    if (contract instanceof Contract) {
      const storageData = await browser.storage.local.get('contracts')
      const contracts = storageData.contracts || {} // If contracts object doesn't exist, initialize it as an empty object

      contracts[contract.hostName] = contract

      await browser.storage.local.set({ contracts })
    }
  }
}

// export default class ContractRepository {
//   constructor () {
//     this.contracts = new Map()
//   }

//   getContract (hostname) {
//     return Contract.fromData(this.contracts.get(hostname)) || null
//   }

//   setContract (contract) {
//     if (contract instanceof Contract) {
//       this.contracts.set(contract.hostName, contract)
//     }
//   }
// }
