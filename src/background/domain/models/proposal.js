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
}
