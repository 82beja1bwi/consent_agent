import _ from 'lodash'
// eslint-disable-next-line no-unused-vars
import PreferencesManager from './preference_manager.js'
// eslint-disable-next-line no-unused-vars
import Calculator from './calculator.js'
import Consent from './models/consent.js'
import Header, { NegotiationStatus } from './models/header.js'

export default class Negotiator {
  /**
   *
   * @param {Calculator} calculator
   * @param {PreferencesManager} preferenceManager
   */
  constructor (calculator, preferenceManager) {
    this.calculator = calculator
    this.preferenceManager = preferenceManager
  }

  /**
   * @returns @param {Header} header a newly initialized header to be appended to the first http-request
   */
  prepareInitialOffer () {
    const consent = new Consent() // empty consent equals reject all
    return new Header()
      .setStatus(NegotiationStatus.EXCHANGE)
      .setConsent(consent)
  }

  /**
   * If the offer could be attractive for the user, True is returned
   * This implementation only accepts an offer if it's the Nash optimal contract
   * @param {Header} header
   * @param {*} domainURL
   * @returns {Boolean} true if offer could be attractive for user
   */
  couldBeAttractiveForUser (header, domainURL) {
    if (!(header instanceof Header)) {
      throw new Error('Expected header to be an instance of Header')
    }

    let couldBeAttractive = false

    // This implementation only accepts an offer, if it's the Nash optimal contract
    const optimalContract = this.prepareCounteroffer(header, domainURL)

    // if (
    // eslint-disable-next-line eqeqeq
    if (_.isEqual(header.consent, optimalContract.consent) &&
    // eslint-disable-next-line eqeqeq
     header.cost == optimalContract.cost &&
    // eslint-disable-next-line eqeqeq
    header.content == optimalContract.content) {
      couldBeAttractive = true
    }

    return couldBeAttractive
  }

  /**
   * Prepare a counter offer
   * This implementation always returns the nash optimal contract
   * @param {Header} header
   * @param {*} hostName
   * @returns a new header
   */
  prepareCounteroffer (header, hostName) {
    if (!(header instanceof Header)) {
      throw new Error('Expected header to be an instance of Header')
    }

    // eslint-disable-next-line no-unneeded-ternary
    const is2C = !header.cost || header?.cost === 0 ? true : false

    // Load or initiate preferences of user and site
    let sitesScoredPreferences = this.preferenceManager.getSitesPreferences(
      hostName,
      is2C
    )

    if (!sitesScoredPreferences) {
      sitesScoredPreferences = header.preferences[0]
      this.preferenceManager.setSitesPreferences(hostName, header.preferences)
    }

    const usersScoredPreferences = this.preferenceManager.getUsersPreferences(
      hostName,
      is2C,
      sitesScoredPreferences
    )

    // Calculate the scoring functions
    const usersScoringFunction = this.calculator.calcUsersScoringFunction(
      usersScoredPreferences
    )
    const sitesScoringFunction = this.calculator.calcSitesScoringFunction(
      sitesScoredPreferences
    )

    // Calculate the optimal contract, in this implementation the Nash contract
    const headerForCounterOffer = this.calculator.calcNashContract(
      usersScoredPreferences,
      sitesScoredPreferences,
      usersScoringFunction,
      sitesScoringFunction
    )

    if (header.status === NegotiationStatus.EXCHANGE) {
      headerForCounterOffer.setPreferences(usersScoredPreferences)
    }

    headerForCounterOffer.status = NegotiationStatus.NEGOTIATION

    return headerForCounterOffer
  }
}
