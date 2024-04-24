// eslint-disable-next-line no-unused-vars

export class Issue {
  /**
   * @param {number} relevance in float (sum of relevances of all issues must be 1)
   * @param {Map<String, number>} resolutions with id and preference score
   */
  constructor (relevance, resolutions) {
    this.relevance = relevance
    this.resolutions = resolutions
  }

  setRelevance (relevance) {
    this.relevance = relevance

    return this
  }

  setResolutions (resolutions) {
    this.resolutions = resolutions

    return this
  }

  getResolutionsKeys () {
    return Array.from(this.resolutions.keys())
  }
}

export default class ScoredPreferences {
  /**
   *
   * @param {Issue} cost
   * @param {Issue} consent
   * @param {Issue} content
   */
  constructor (cost, consent, content) {
    this.cost = cost
    this.consent = consent
    this.content = content
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

  toBase64EncodedJSON () {
    return btoa(JSON.stringify(this))
  }

  static fromBase64EncodedJSON (json) {
    const data = JSON.parse(atob(json))
    const scoredPreferences = new ScoredPreferences(
      new Issue(),
      new Issue(),
      new Issue()
    )

    for (const key in data) {
      if (!Object.keys(scoredPreferences).includes(key)) {
        throw new Error(`Unknown issue '${key}'.`)
      }

      scoredPreferences[`${key}`]
        .setRelevance(data[key].relevance)
        .setResolutions(data[key].resolutions)
    }

    const totalRelevance = Object.values(scoredPreferences).reduce(
      (total, issue) => {
        return total + (issue.relevance || 0)
      },
      0
    )

    if (totalRelevance !== 1) throw Error('Sum of relevances must be 1')

    return scoredPreferences
  }
}
