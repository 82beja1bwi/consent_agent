// eslint-disable-next-line no-unused-vars
import ScoredConsentPreferences from './scored_consent_preferences.js'

export default class ScoredPreferences {
  /**
     * Create a new ScoredPreferences instance.
     * @constructor
     * @param {Map<number, number>} cost
     * @param {ScoredConsentPreferences} consent
     * @param {Map<number, number>} content
     */
  constructor (cost, consent, content) {
    this.cost = cost
    this.consent = consent
    this.content = content
  }

  toBase64EncodedJSON () {
    return btoa(JSON.stringify(this))
  }

  static fromBase64EncodedJSON (json) {
    const data = JSON.parse(atob(json))
    return new ScoredPreferences(
      data.cost,
      data.consent,
      data.content
    )
  }
}
