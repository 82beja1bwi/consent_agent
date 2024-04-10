// eslint-disable-next-line no-unused-vars
import Consent from './consent.js'

export default class Contract {
  /**
   * Create a new Contract instance.
   * @constructor
   * @param {string} hostName - the sites main domain without.
   * @param {Consent} consent
   * @param {number} cost
   * @param {number} content
   */
  constructor (hostName, consent, cost, content) {
    this.hostName = hostName
    this.consent = consent
    this.cost = cost
    this.content = content
  }

  setHostName (value) {
    this.hostName = value
    return this
  }

  setConsent (value) {
    this.consent = value
    return this
  }

  setCost (value) {
    this.cost = value
    return this
  }

  setContent (value) {
    this.content = value
    return this
  }
}
