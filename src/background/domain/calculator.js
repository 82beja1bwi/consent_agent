import Consent from './models/consent.js'
import Header from './models/header.js'
import ScoredPreferences from './models/scored_preferences.js'

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
    return this.#preferencesDataToFunction(scoredPreferences, true)
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
    return this.#preferencesDataToFunction(scoredPreferences, false)
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
    let highscore = 0
    let bestContract = null
    const costResolutions = sitesScoredPreferences.cost?.resolutions ?? { 0: null }
    const consentCombinations = []
    const limit = Object.keys(
      sitesScoredPreferences.consent.resolutions
    ).length

    this.#combineBools(limit, [], consentCombinations)

    // For all possible combinations of cost, content and consent calculate the product scoring functions
    for (const costKey in costResolutions) {
      // costKey only relevant in 3C negotiation
      for (const contentKey in sitesScoredPreferences.content.resolutions) {
        for (let i = 0; i < consentCombinations.length; i++) {
          const tempProduct = this.#calcContractValue(
            usersScoringFunction,
            sitesScoringFunction,
            consentCombinations[i],
            usersScoredPreferences.content.resolutions[contentKey],
            sitesScoredPreferences.content.resolutions[contentKey],
            usersScoredPreferences.cost?.resolutions?.[costKey],
            sitesScoredPreferences.cost?.resolutions?.[costKey]
          )

          console.log(tempProduct, '   ', [consentCombinations[i], contentKey, costKey])

          if (tempProduct > highscore) {
            // Found new best contract
            highscore = tempProduct
            bestContract = [...consentCombinations[i], contentKey, costKey]
          }
        }
      }
    }
    console.log('highscore ', highscore)
    console.log(bestContract)

    // Map interim data model to contract
    const consent = new Consent()

    Object.keys(sitesScoredPreferences.consent.resolutions).forEach(
      (resolution, index) => {
        consent[resolution] = bestContract[index]
      }
    )

    return new Header()
      .setConsent(consent)
      .setCost(bestContract[bestContract.length - 1])
      .setContent(bestContract[bestContract.length - 2])
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
   * 100 * ((0.4 * (1 - 0.3 * analytics - 0.5 * marketing - 0.2 * personalizedAds) + 0.6 * contentScore)
   *
   * OUTPUT (!isUserPreferences)
   * 100 * ((0.4 * (0 + 0.3 * analytics + 0.5 * marketing + 0.2 * personalizedAds) + 0.6 * contentScore)
   */

  #preferencesDataToFunction = (scoredPreferences, isUserPreferences) => {
    const is3CNegotiation = scoredPreferences.cost?.relevance
    const consentResolutions = scoredPreferences.consent.resolutions
    const relevanceOfConsent = scoredPreferences.consent.relevance
    const relevanceOfContent = scoredPreferences.content.relevance

    return function (bools, contentScore, costScore) {
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
   * Recursively create a list of all possible consen combinations
   * @param {number} limit if consent options {analytics, marketing} then limit is 2 ...
   * @param {[Boolean]} bools initially empty
   * @param {[[Boolean]]} resultingListOfBoolsLists will be filled during the recursion
   * @returns resultingListOfBoolsLists
   */
  #combineBools = (
    limit, // initally e.g. 3
    bools, // initally an empty array
    resultingListOfBoolsLists
  ) => {
    if (limit === 0) {
      // console.log(bools)// this i want to add to a list of lists
      resultingListOfBoolsLists.push([...bools])
      return
    }
    // combine remaining consent options until last option included in combination
    limit--

    for (const bool of [false, true]) {
      bools.push(bool)
      this.#combineBools(limit, bools, resultingListOfBoolsLists)
      bools.pop(bool)
    }
  }

  /**
   * Calculate the value (product) of a contract
   * @param {Function} usersScoringFunction
   * @param {Function} sitesScoringFunction
   * @param {[Boolean]} consentCombination
   * @param {number} usersContentPreference
   * @param {number} sitesContentPreference
   * @param {number} usersCostPreference
   * @param {number} sitesCostPreference
   * @returns
   */
  #calcContractValue = (
    usersScoringFunction,
    sitesScoringFunction,
    consentCombination,
    usersContentPreference,
    sitesContentPreference,
    usersCostPreference,
    sitesCostPreference
  ) => {
    return (
      usersScoringFunction(
        consentCombination,
        usersContentPreference,
        usersCostPreference
      ) *
      sitesScoringFunction(
        consentCombination,
        sitesContentPreference,
        sitesCostPreference
      )
    )
  }
}
