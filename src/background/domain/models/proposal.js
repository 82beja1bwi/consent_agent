import Contract from './contract.js'

export default class Proposal extends Contract {
  constructor (hostName, consent, cost, content, userHasAccepted) {
    super(hostName, consent, cost, content)
    this.userHasAccepted = userHasAccepted
  }

  setUserHasAccepted (bool) {
    this.userHasAccepted = bool

    return this
  }

  static fromData (data) {
    if (!data) return null

    const contract = Contract.fromData(data)
    return new Proposal()
      .setHostName(contract.hostName)
      .setConsent(contract.consent)
      .setContent(contract.content)
      .setCost(contract.cost)
      .setUserHasAccepted(data.userHasAccepted)
  }
}
