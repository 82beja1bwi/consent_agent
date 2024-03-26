import Consent from './models/consent'
import Header, { NegotiationStatus } from './models/header'

export class Negotiator {
/**
 * @returns @param {Header} header a newly initialized header to be appended to the first http-request
 */
  prepareInitialOffer () {
    const consent = new Consent()
    consent.rejectAll = true
    return new Header(NegotiationStatus.EXCHANGE, null, consent, null, null)
  }

  /**
 * prepare a counteroffer
 * @param {Header} header
 * @param {URL} domainURL
 */
  prepareCounteroffer (header, domainURL) {
    let usersScoredPreferences
    let sitesScoredPreferences

    if (!(header instanceof Header)) {
      throw new Error('Expected header to be an instance of Header')
    }

    const nashContract = calcNash(usersScoredPreferences, sitesScoredPreferences)

  // simple first agent: FOAT Full Trust will always counter offer or propose the NashEquilibrium
  // load user's preferences
  //   DONT EXIST YET -> init preferences for 2C
  //   2c to 3c -> NOT HANDLED HERE... das ist dann aus Eigeninitiative der Extension
  // load site's preferences
  //   dont exist && header has preferences -> store them
  //   calculate NASH (fair & efficient)
  // (evaluate received offer)
  // fill header with Nash proposal (FOAT 1 step)
  }
}
