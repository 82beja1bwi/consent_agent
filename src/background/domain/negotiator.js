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
    const consent = new Consent()
    consent.rejectAll = true
    return new Header(NegotiationStatus.EXCHANGE, null, consent, null, null)
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

    if (
      header.consent === optimalContract.consent &&
      header.cost === optimalContract.cost &&
      header.content === optimalContract.content
    ) {
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

    const is2C = !!header.cost

    const sitesScoredPreferences = this.preferenceManager.getSitesPreferences(
      hostName,
      is2C,
      header
    )

    const usersScoredPreferences = this.preferenceManager.getUsersPreferences(
      hostName,
      is2C
    )

    // TODO load preferences
    //    OR retrieve them from header
    //    OR calculate/estimate them

    const usersScoringFunction = this.calculator.calcUsersScoringFunction(
      usersScoredPreferences
    )
    const sitesScoringFunction = this.calculator.calcSitesScoringFunction(
      sitesScoredPreferences
    )

    // This implementation bases on the nash optimal contract
    const counterOfferHeader = this.calculator.calcNashContract(
      usersScoredPreferences,
      sitesScoredPreferences,
      usersScoringFunction,
      sitesScoringFunction
    )

    counterOfferHeader.status = NegotiationStatus.NEGOTIATION

    return counterOfferHeader
  }
}
