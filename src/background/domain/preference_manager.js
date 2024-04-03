// eslint-disable-next-line no-unused-vars
import PreferencesRepository from '../storage/preferences_repository.js'
// eslint-disable-next-line no-unused-vars
import Header from './models/header.js'
// eslint-disable-next-line no-unused-vars
import ScoredPreferences from './models/scored_preferences/scored_preferences.js'

export default class PreferenceManager {
  /**
   *
   * @param {PreferencesRepository} preferenceRepository
   */
  constructor (preferenceRepository) {
    this.preferenceRepository = preferenceRepository
  }

  /**
   * Initialize the preferences of a user for a certain site.
   * Call when sending the first request to the site
   * @param {String} hostName
   * @return {ScoredPreferences}
   */
  initUsersPreferences (hostName) {
    const scoredPreferences = new ScoredPreferences()
    scoredPreferences.consent = {
      relevance: null,
      resolutions: this.preferenceRepository.getUsersDefaultConsentPreferences()
    }
    this.preferenceRepository.setUsersPreferences(hostName, scoredPreferences)

    return scoredPreferences
  }

  /**
   *
   * @param {String} hostName
   * @param {Boolean} is2C
   * @param {ScoredPreferences} sitesScoredPreferences
   * @returns {ScoredPreferences}
   */
  getUsersPreferences (hostName, is2C, sitesScoredPreferences) {
    const scoredPreferences = this.preferenceRepository.getUsersPreferences(
      hostName,
      is2C
    )

    if (!scoredPreferences) {
      throw new Error('No User Preferences for host: ', hostName)
    }

    const requiredConsentKeys = Object.keys(
      sitesScoredPreferences.consent.resolutions
    )
    const actualConsentKeys = Object.keys(
      scoredPreferences.consent.resolutions
    )
    /* NOT ACTUALLY A CASE THESE WILL BE SET IN ANOTHER PLACE BY THE EXTENSION
    // case A, cost wurde noch nicht an optionen der seite angepasst
    if (sitesScoredPreferences.cost && !scoredPreferences.cost) {
    } */

    // case B, consent wurde noch nicht an optionen der seite angepasst
    if (requiredConsentKeys.length < actualConsentKeys.length) {
      let pointsToBeSplit = 0
      actualConsentKeys.forEach((key) => {
        if (!requiredConsentKeys.includes(key)) {
          pointsToBeSplit += scoredPreferences.consent.resolutions[key]
          delete scoredPreferences.consent.resolutions[key]
        }
      })
      if (pointsToBeSplit > 0) {
        const l = requiredConsentKeys.length
        const points = pointsToBeSplit / l
        for (const key in scoredPreferences.consent.resolutions) {
          const value = scoredPreferences.consent.resolutions[key]
          scoredPreferences.consent.resolutions[key] =
            Math.round((value + points) * 100) / 100
        }
      }
    }

    // case C, content wurde noch nicht an optionen der seite angepasst

    return scoredPreferences
  }

  /**
   *
   * @param {String} hostName
   * @param {Boolean} is2C
   * @param {Header} header
   * @returns {ScoredPreferences}
   */
  getSitesPreferences (hostName, is2C, header) {
    let scoredPreferences = this.preferenceRepository.getSitesPreferences(
      hostName,
      is2C
    )

    if (!scoredPreferences) {
      if (!header.preferences) throw new Error('No Preferences Provided')
      scoredPreferences = header.preferences
      this.preferenceRepository.setSitesPreferences(
        hostName,
        scoredPreferences
      )
    }

    return scoredPreferences
  }
}
