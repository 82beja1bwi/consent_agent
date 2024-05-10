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
    return Object.keys(this.resolutions)
  }

  /** entity to instance */
  static fromData (data) {
    if (!data) return null

    return new Issue()
      .setRelevance(data.relevance)
      .setResolutions(data.resolutions)
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
    if (this.cost === null) {
      // dont show null cost in json
      this.cost = undefined
    }
    return btoa(JSON.stringify(this))
  }

  /**
   *
   * @param {*} json a JSON.parse(string)
   * @returns
   */
  static fromJSON (json) {
    const scoredPreferences = new ScoredPreferences(
      new Issue(),
      new Issue(),
      new Issue()
    )

    for (const key in json) {
      if (!Object.keys(scoredPreferences).includes(key)) {
        throw new Error(`Unknown issue '${key}'.`)
      }

      scoredPreferences[`${key}`]
        .setRelevance(json[key]?.relevance)
        .setResolutions(json[key]?.resolutions)
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

  /** entity to instance */
  static fromData (data) {
    if (!data) return null

    const cost = Issue.fromData(data.cost)
    const consent = Issue.fromData(data.consent)
    const content = Issue.fromData(data.content)

    return new ScoredPreferences()
      .setCost(cost)
      .setConsent(consent)
      .setContent(content)
  }
}
