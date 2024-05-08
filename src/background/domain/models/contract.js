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
   * @param score
   */
  constructor (hostName, consent, cost, content, score) {
    this.hostName = hostName
    this.consent = consent
    this.cost = cost
    this.content = content
    this.score = score
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

  setScore (value) {
    this.score = value
    return this
  }

  /** entity to instance */
  static fromData (data) {
    if (!data) return null

    const consent = Consent.fromObject(data.consent)

    return new Contract()
      .setHostName(data.hostName)
      .setConsent(consent)
      .setCost(data.cost)
      .setContent(data.content)
      .setScore(data.score)
  }
}
