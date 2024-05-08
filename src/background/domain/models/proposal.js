import Contract from './contract.js'

export default class Proposal extends Contract {
  constructor (hostName, consent, cost, content, score, userHasAccepted) {
    super(hostName, consent, cost, content, score)
    this.userHasAccepted = userHasAccepted
  }

  setUserHasAccepted (bool) {
    this.userHasAccepted = bool

    return this
  }

  /** entity to instance */
  static fromData (data) {
    if (!data) return null

    const contract = Contract.fromData(data)
    return new Proposal()
      .setHostName(contract.hostName)
      .setConsent(contract.consent)
      .setContent(contract.content)
      .setCost(contract.cost)
      .setScore(contract.score)
      .setUserHasAccepted(data.userHasAccepted)
  }
}
