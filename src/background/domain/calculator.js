import Consent from './models/consent.js'
import Header from './models/header.js'
import ScoredPreferences from './models/scored_preferences/scored_preferences.js'

/**
 * can calculate Nash-optimal contracts
 * initialize by first calling initUserScoringFunction & initSitesScoringFunction before calling the optimization method
 */
export default class Calculator {
  /**
   * Call to init the scoring function of the user.
   *
   * example inputs and outputs see in calculator.test.js
   *
   * @param {*} scoredPreferences to be transformed into the function
   */
  calcUsersScoringFunction (scoredPreferences) {
    if (!(scoredPreferences instanceof ScoredPreferences)) {
      throw Error('Preferences must be in data model ScoredPreferences')
    }
    return this._preferencesDataToFunction(scoredPreferences, true)
  }

  /**
   * Call to init the scoring function of the site.
   *
   * @param {*} scoredPreferences to be transformed into the function
   */
  calcSitesScoringFunction (scoredPreferences) {
    if (!(scoredPreferences instanceof ScoredPreferences)) {
      throw Error('Preferences must be in data model ScoredPreferences')
    }
    return this._preferencesDataToFunction(scoredPreferences, false)
  }

  /**
   * Change-Proposal: Nash optimal seem to be very imbalanced from time to time (s. Trello). Maybe include balance-score
   *
   * Calculates the Nash-optimal contract. For example inputs and expected outputs see testfile calculator.test.js
   *
   * @param {ScoredPreferences} usersScoredPreferences
   * @param {ScoredPreferences} sitesScoredPreferences
   * @param {} usersScoringFunction
   * @param {} sitesScoringFunction
   * @returns {Header} the header with nash optimal contract
   */
  calcNashContract (
    usersScoredPreferences,
    sitesScoredPreferences,
    usersScoringFunction,
    sitesScoringFunction
  ) {
    // In these nested loops, the best contract amongst all possible combinations of cost,
    // content and consent preferences is found
    const temporaryResult = { highscore: 0, bestContract: null }
    const booleans = []

    const costResolutions = sitesScoredPreferences.cost.resolutions ?? {
      0: null
    }

    for (const costKey in costResolutions) {
      // costKey only relevant in 3C negotiation
      for (const contentKey in sitesScoredPreferences.content
        .resolutions) {
        // a recursive function to produce as many bools as needed to fill the negotiated consent resolutions
        this._recursivelyCombineToOptimalContract(
          Object.keys(sitesScoredPreferences.consent.resolutions).length,
          booleans,
          contentKey,
          costKey,
          sitesScoredPreferences.content.resolutions[contentKey],
          usersScoredPreferences.content.resolutions[contentKey],
          sitesScoredPreferences.cost.resolutions?.[costKey],
          usersScoredPreferences.cost.resolutions?.[costKey],
          sitesScoringFunction,
          usersScoringFunction,
          temporaryResult
        )
      }
    }
    console.log('hihgscore ', temporaryResult.highscore)
    console.log(temporaryResult.bestContract)

    // Map interim data model to contract
    const consent = new Consent()

    Object.keys(sitesScoredPreferences.consent.resolutions).forEach(
      (resolution, index) => {
        consent[resolution] = temporaryResult.bestContract[index]
      }
    )

    return new Header(
      null,
      null,
      consent,
      temporaryResult.bestContract[temporaryResult.bestContract.length - 1],
      temporaryResult.bestContract[temporaryResult.bestContract.length - 2]
    )
  }

  /**
   * Transforms the exchange data model for ScoredPreferences to a function.
   * This function can be used to calculate the user's or site's preference score for a contract
   * @param {ScoredPreferences} scoredPreferences
   * @param {boolean} isUserPreferences
   * @returns a callback to calculate the user's or site's preference score for a contract
   *
   * Example for a user's scored preferences:
   * INPUT {
   * consent: {
   *   relevance: 0.4,
   *   resolutions: {
   *     analytics: 0.3,
   *     marketing: 0.5,
   *     personalizedAds: 0.2
   *   }
   * },
   * content: {
   *   relevance: 0.6,
   *   resolutions: {
   *     100: 1,
   *     70: 0.9
   *   }
   * }
   * OUTPUT (isUserPreferences)
   * 100 * (0.4 * (1 - 0.3 * analytics - 0.5 * marketing - 0.2 * personalizedAds) + 0.6 * contentScore
   *
   * OUTPUT (!isUserPreferences)
   * 100 * (0.4 * (0 + 0.3 * analytics + 0.5 * marketing + 0.2 * personalizedAds) + 0.6 * contentScore)
   */

  _preferencesDataToFunction (scoredPreferences, isUserPreferences) {
    // if (!(scoredPreferences instanceof ScoredPreferences)) throw new Error('Not instanceof ScoredPreferences')

    const is3CNegotiation = !!scoredPreferences.cost.relevance
    const consentResolutions = scoredPreferences.consent.resolutions
    const relevanceOfConsent = scoredPreferences.consent.relevance
    const relevanceOfContent = scoredPreferences.content.relevance

    return function (bools, contentScore, costScore) {
      console.log(
        'User? ',
        isUserPreferences,
        ', ',
        bools,
        ', ',
        contentScore,
        ', ',
        costScore
      )
      if (bools.length < Object.keys(consentResolutions).length) {
        throw new Error('Not enough bools provided')
      }
      let consentScore = isUserPreferences ? 1 : 0
      let i = 0
      for (const key in consentResolutions) {
        const product = consentResolutions[key] * bools[i]
        isUserPreferences
          ? (consentScore -= product)
          : (consentScore += product)
        // TODO this is currently missing the case, where reject all still gets 20 base points
        i++
      }

      let result =
        relevanceOfConsent * consentScore + relevanceOfContent * contentScore

      if (is3CNegotiation) {
        result += scoredPreferences.cost.relevance * costScore
      }

      return Math.round(100 * result)
    }
  }

  /**
   * !!is recursive!!
   *
   * combines all possible boolean values for the consent resolutions
   * (analytics, analytics && marketing ... analytics && marketing && ... && personalizedAds)
   * to calculate the score of each possible contract.
   *
   * @param {number} limit number of consent resolutions (e.g. 3 if only analytics, marketing and personalizedAds are requested by the site)
   * @param {*} bools an empty list, which will be filled and emptied during the recursions
   * @param {*} sitesContentPreference site's preference score for the current content resolution
   * @param {*} usersContentPreference user's preference score for the current content resolution
   * @param {*} result A return object to be filled
   * @returns an object with a highscore of the best contract and the best contract
   */
  _recursivelyCombineToOptimalContract (
    limit,
    bools,
    contentKey,
    costKey,
    sitesContentPreference,
    usersContentPreference,
    sitesCostPreference,
    usersCostPreference,
    sitesScoringFunction,
    usersScoringFunction,
    result
  ) {
    if (limit === 0) {
      const product =
        usersScoringFunction(
          bools,
          usersContentPreference,
          usersCostPreference
        ) *
        sitesScoringFunction(
          bools,
          sitesContentPreference,
          sitesCostPreference
        )
      console.log(product, '   ', [...bools, contentKey, costKey])
      if (product > result.highscore) {
        // Found new best contract
        result.highscore = product
        result.bestContract = [...bools, contentKey, costKey]
      }
      return
    }
    // combine remaining consent options until last option included in combination

    limit--

    for (const bool of [false, true]) {
      bools.push(bool)
      this._recursivelyCombineToOptimalContract(
        limit,
        bools,
        contentKey,
        costKey,
        sitesContentPreference,
        usersContentPreference,
        sitesCostPreference,
        usersCostPreference,
        sitesScoringFunction,
        usersScoringFunction,
        result
      )
      bools.pop(bool)
    }
  }
}
