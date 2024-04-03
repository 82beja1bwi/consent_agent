// eslint-disable-next-line no-unused-vars
import ScoredConsentPreferences from './scored_consent_preferences.js'

export const ConsentOption = Object.freeze({
  ANALYTICS: 'analytics',
  MARKETING: 'marketing',
  PERSONALIZED_CONTENT: 'personalizedContent',
  PERSONALIZED_ADS: 'personalizedAds',
  EXTERNAL_CONTENT: 'externalContent',
  IDENTIFICATION: 'identification'
})

export const NegotiationIssues = Object.freeze({
  COST: 'cost',
  CONSENT: 'consent',
  CONTENT: 'content'
})

export default class ScoredPreferences {
  /**
   * Create a new ScoredPreferences instance.
   */
  constructor () {
    this.cost = {}
    this.consent = {}
    this.content = {}
  }

  /**
   *
   * @param {*} issue @see {@link NegotiationIssues}
   * @param {Number} relevance double in range from 0 to 1
   */
  setRelevanceOfIssue (issue, relevance) {
    switch (issue) {
      case NegotiationIssues.COST:
        this.cost.relevance = relevance
        break
      case NegotiationIssues.CONSENT:
        this.consent.relevance = relevance
        break
      case NegotiationIssues.CONTENT:
        this.content.relevance = relevance
        break
      default:
        throw Error(`Issue '${issue}' does not exist.`)
    }
  }

  /**
   * set the resolutions for an issue.
   * resolution is a map of type {resolution:preferenceValue}.
   * Read thesis for detailed document description.
   *
   * Examples:
   * cost {5:1, 1:0.5,...}
   * content: {100:1, 70:0.8,...}
   * consent: {analytics:0.2, marketing 0.3,...}
   *
   * @param {String} issue cost, consent or content
   * @param {Map} resolutions @see {@link ConsentOption} for available consent resolutions.
   */
  setResolutionsOfIssue (issue, resolutions) {
    if (issue === NegotiationIssues.CONSENT) {
      const validResolutions = Object.keys(resolutions).every((key) => {
        return Object.values(ConsentOption).includes(key)
      })
      if (!validResolutions) throw Error('Unvalid resolutions.')
    }

    switch (issue) {
      case NegotiationIssues.COST:
        this.cost.resolutions = resolutions
        break
      case NegotiationIssues.CONSENT:
        this.consent.resolutions = resolutions
        break
      case NegotiationIssues.CONTENT:
        this.content.resolutions = resolutions
        break
      default:
        throw Error(`Issue '${issue}' does not exist.`)
    }
  }

  toBase64EncodedJSON () {
    return btoa(JSON.stringify(this))
  }

  static fromBase64EncodedJSON (json) {
    const data = JSON.parse(atob(json))
    const scoredPreferences = new ScoredPreferences()
    for (const key in data) {
      if (!Object.values(NegotiationIssues).includes(key)) throw Error(`Unkown issue '${key}'.`)
      scoredPreferences.setResolutionsOfIssue(key, data[key].resolutions)
      scoredPreferences.setRelevanceOfIssue(key, data[key].relevance)
    }

    const totalRelevances =
      (scoredPreferences.cost.relevance
        ? scoredPreferences.cost.relevance
        : 0) +
      scoredPreferences.consent.relevance +
      scoredPreferences.content.relevance

    if (totalRelevances !== 1) throw Error('Sum of relevances must be 1')
    return scoredPreferences
  }
}
