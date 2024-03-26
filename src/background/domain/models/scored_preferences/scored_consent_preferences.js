export default class ScoredConsentPreferences {
  /**
     * Create a new ScoredConsentPreferences instance.
     * Each variable has a number, the preference score.
     *
     * @constructor
     * @param {number} rejectAll
     * @param {number} acceptAll
     * @param {number} analytics
     * @param {number} marketing
     * @param {number} personalizedContent
     * @param {number} personalizedAds
     * @param {number} externalContent
     * @param {number} identification
     */
  constructor (rejectAll, acceptAll, analytics, marketing, personalizedContent, personalizedAds, externalContent, identification) {
    this.rejectAll = rejectAll
    this.acceptAll = acceptAll
    this.analytics = analytics
    this.marketing = marketing
    this.personalizedContent = personalizedContent
    this.personalizedAds = personalizedAds
    this.externalContent = externalContent
    this.identification = identification
  }

  /*
    toJSON(){
        return JSON.stringify(this)
    }
    */

  static fromBase64EncodedJSON (json) {
    const data = JSON.parse(atob(json))
    return new ScoredConsentPreferences(
      data.rejectAll,
      data.acceptAll,
      data.analytics,
      data.marketing,
      data.personalizedContent,
      data.personalizedAds,
      data.externalContent,
      data.identification
    )
  }
}
