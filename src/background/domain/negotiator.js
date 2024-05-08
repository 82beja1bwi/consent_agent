import _ from 'lodash'
// eslint-disable-next-line no-unused-vars
import PreferencesManager from './preference_manager.js'
// eslint-disable-next-line no-unused-vars
import Calculator, { NASH_CONTRACT } from './calculator.js'
import Consent from './models/consent.js'
import Header, { NegotiationStatus } from './models/header.js'
import Proposal from './models/proposal.js'

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
   * @param {*} hostname
   * @returns Boolean true if offer could be attractive for user
   */
  async couldBeAttractiveForUser (header, hostname) {
    if (!(header instanceof Header)) {
      throw new Error('Expected header to be an instance of Header')
    }

    let couldBeAttractive = false

    // This implementation only accepts an offer, if it's the Nash optimal contract
    const optimalContract = await this.prepareCounteroffer(header, hostname)

    // if (
    // eslint-disable-next-line eqeqeq
    if (
      _.isEqual(header.consent, optimalContract.consent) &&
      // eslint-disable-next-line eqeqeq
      header.cost == optimalContract.cost &&
      // eslint-disable-next-line eqeqeq
      header.content == optimalContract.content
    ) {
      couldBeAttractive = true
    }

    return couldBeAttractive
  }

  /**
   * Create alternative proposals very similar to the one made by the site,
   * so that user has more than one option to select from
   *
   * This implementation only accepts the Nash optimal contract as a proposal.
   * Similar alternatives are options slightly less attractive.
   *
   * @param {Number} amount how many alternatives? 1, 2, ..., n
   * @param {Header} header
   * @param {String} hostname
   * @returns [Proposal]
   */
  async createSimilarAlternatives (amount, is2C, hostname) {
    const sitesScoredPreferences =
      await this.preferenceManager.getSitesPreferences(hostname, is2C)

    const usersScoredPreferences =
      await this.preferenceManager.getUsersPreferences(
        hostname,
        is2C,
        sitesScoredPreferences
      )

    const contracts = this.#getBestContracts(
      amount,
      usersScoredPreferences,
      sitesScoredPreferences
    )

    const proposals = []

    contracts.forEach((contract) => {
      proposals.push(
        new Proposal(
          hostname,
          contract.consent,
          contract.cost,
          contract.content,
          contract.score,
          false
        )
      )
    })

    return proposals
  }

  /**
   * Prepare a counter offer
   * This implementation always returns the nash optimal contract
   * @param {Header} header
   * @param {*} hostName
   * @returns Header a new header
   */
  async prepareCounteroffer (header, hostName) {
    console.log('3 preparing counteroffer')
    if (!(header instanceof Header)) {
      throw new Error('Expected header to be an instance of Header')
    }

    // eslint-disable-next-line no-unneeded-ternary
    const is2C = !header.cost || header?.cost === 0 ? true : false

    let sitesScoredPreferences =
      await this.preferenceManager.getSitesPreferences(hostName, is2C)

    if (!sitesScoredPreferences) {
      sitesScoredPreferences = header.preferences[0]
      await this.preferenceManager.setSitesPreferences(
        hostName,
        header.preferences
      )
    }

    const usersScoredPreferences =
      await this.preferenceManager.getUsersPreferences(
        hostName,
        is2C,
        sitesScoredPreferences
      )

    console.log('Got Preferences', usersScoredPreferences, sitesScoredPreferences)

    const result = this.#getBestContracts(
      1,
      usersScoredPreferences,
      sitesScoredPreferences
    )
    console.log('best Contracts ', result)

    const nashContract = result[0]
    console.log('nash Contract ', result)

    const counterOfferHeader = new Header()

    if (header.status === NegotiationStatus.EXCHANGE) {
      counterOfferHeader.setPreferences(usersScoredPreferences)
    }

    counterOfferHeader
      .setStatus(NegotiationStatus.NEGOTIATION)
      .setConsent(nashContract.consent)
      .setCost(nashContract.cost)
      .setContent(nashContract.content)

    console.log('Counter Offer Header ', counterOfferHeader)

    return counterOfferHeader
  }

  #getBestContracts (amount, usersScoredPreferences, sitesScoredPreferences) {
    // Calculate the scoring functions
    const usersScoringFunction = this.calculator.calcUsersScoringFunction(
      usersScoredPreferences
    )
    const sitesScoringFunction = this.calculator.calcSitesScoringFunction(
      sitesScoredPreferences
    )

    // Calculate the optimal contract, in this implementation the Nash contract
    const result = this.calculator.calcNashBestContracts(
      usersScoredPreferences,
      sitesScoredPreferences,
      usersScoringFunction,
      sitesScoringFunction,
      amount
    )

    return result
  }
}
