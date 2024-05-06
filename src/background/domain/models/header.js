import ScoredPreferences from './scored_preferences.js'
import Consent from './consent.js'

export const NegotiationStatus = {
  EXCHANGE: 'exchange',
  NEGOTIATION: 'negotiation',
  ACCEPTED: 'accepted'
}

export default class Header {
  /**
   * Create a new Header instance.
   * @constructor
   * @param {NegotiationStatus} status
   * @param {[ScoredPreferences]} preferences
   * @param {Consent} consent
   * @param {number} cost
   * @param {number} content
   */
  constructor (status, preferences, consent, cost, content) {
    this.status = status // domain of website
    this.preferences = preferences
    this.consent = consent // [analytics, marketing...] a list!
    this.cost = cost || 0
    this.content = content || 0
  }

  setStatus (status) {
    this.status = status

    return this
  }

  setPreferences (preferences) {
    this.preferences = preferences

    return this
  }

  setCost (cost) {
    this.cost = cost

    return this
  }

  setConsent (consent) {
    this.consent = consent

    return this
  }

  setContent (content) {
    this.content = content

    return this
  }

  // Deserialization
  toString () {
    let header = 'status=' + this.status.toString() + ' '

    if (this.preferences && this.preferences instanceof ScoredPreferences) {
      // TODO: toBase64EncodedJSON for preferences
      header += 'preferences=' + this.preferences.toBase64EncodedJSON() + ' '
    }

    if (this.cost) {
      header += 'cost=' + this.cost + ' '
    }

    if (this.consent && this.consent instanceof Consent) {
      // TODO: toString for consent
      const concat = this.consent.toString()
      if (concat.length > 0) {
        header += 'consent=' + concat + ' '
      }
    }

    if (this.content) {
      header += 'content=' + this.content
    }

    console.log('CREATED HEADER STRING', header)

    return header.trimEnd()
  }

  // Serialization
  // status=... (optional) preferences=base64encondedString base64encodedString (optional) consent=analytics marketing ...
  //       (optional) cost=2 (optional) content=50
  static fromString (header) {
    const patterns = [
      /status=[^ ]+/,
      /preferences=[^ ]+/,
      /consent=.*?(?= content=|$)/,
      /cost=[^ ]+/,
      /content=[^ ]+/
    ]
    const matches = patterns.map((p) => {
      const match = p.exec(header)
      // return match ? match[0].split('=')[1] : null
      return match ? match[0].slice(match[0].indexOf('=') + 1) : null
    })

    if (matches[1]) {
      const data = JSON.parse(atob(matches[1]))

      matches[1] = Array.isArray(data)
        ? [ScoredPreferences.fromJSON(data[0]), ScoredPreferences.fromJSON(data[1])]
        : [ScoredPreferences.fromJSON(data)]
    }

    if (matches[2]) {
      matches[2] = Consent.fromString(matches[2])
    }

    return new Header()
      .setStatus(matches[0])
      .setPreferences(matches[1])
      .setConsent(matches[2])
      .setCost(matches[3] ? parseFloat(matches[3]) : 0)
      .setContent(matches[4] ? parseFloat(matches[4]) : 0)
  }
}
