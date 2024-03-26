// eslint-disable-next-line no-unused-vars
import Consent from './consent.js'

export default class Contract {
  /**
       * Create a new Contract instance.
       * @constructor
       * @param {string} baseURL - the sites main domain without.
       * @param {Consent} consent
       * @param {number} cost
       * @param {number} content
       */
  constructor (baseURL, consent, cost, content) {
    this.baseURL = baseURL
    this.consent = consent
    this.cost = cost
    this.content = content
  }
}
