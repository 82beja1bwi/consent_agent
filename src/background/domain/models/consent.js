/// Consent in bool
/// Current state is bool = true
export default class Consent {
  constructor (
    analytics,
    marketing,
    personalizedContent,
    personalizedAds,
    externalContent,
    identification
  ) {
    this.analytics = analytics
    this.marketing = marketing
    this.personalizedContent = personalizedContent
    this.personalizedAds = personalizedAds
    this.externalContent = externalContent
    this.identification = identification
  }

  setAnalytics (bool) {
    this.analytics = bool
    return this // Return 'this' for chaining
  }

  setMarketing (bool) {
    this.marketing = bool
    return this // Return 'this' for chaining
  }

  setPersonalizedContent (bool) {
    this.personalizedContent = bool
    return this // Return 'this' for chaining
  }

  setPersonalizedAds (bool) {
    this.personalizedAds = bool
    return this // Return 'this' for chaining
  }

  setExternalContent (bool) {
    this.externalContent = bool
    return this // Return 'this' for chaining
  }

  setIdentification (bool) {
    this.identification = bool
    return this // Return 'this' for chaining
  }

  isRejectAll () {
    return !(this.analytics && this.marketing && this.personalizedContent && this.personalizedAds && this.externalContent && this.identification)
  }

  toString () {
    let string = ''

    if (this.analytics) {
      string += 'analytics '
    }
    if (this.marketing) {
      string += 'marketing '
    }
    if (this.personalizedContent) {
      string += 'personalizedContent '
    }
    if (this.personalizedAds) {
      string += 'personalizedAds '
    }
    if (this.externalContent) {
      string += 'externalContent '
    }
    if (this.identification) {
      string += 'identification '
    }

    return string.trimEnd()
  }

  // create instance from consent string (s. header)
  // example string: 'rejectAll acceptAll analytics marketing personalizedContent personalizedAds externalContent identification'
  static fromString (string) {
    // Split the string into individual words
    const options = string.split(' ')

    const consent = new Consent()

    // Set the boolean values based on the words in the string
    options.forEach((word) => {
      if (Consent.prototype.hasOwnProperty.call(consent, word)) {
        consent[`${word}`] = true
      }
    })

    // Return a new instance of Consent with the boolean values
    return consent
  }

  static fromObject (object) {
    const consent = new Consent()
    consent
      .setAnalytics(object.analytics)
      .setExternalContent(object.externalContent)
      .setIdentification(object.identification)
      .setMarketing(object.marketing)
      .setPersonalizedAds(object.personalizedAds)
      .setPersonalizedContent(object.personalizedContent)

    return consent
  }
}
