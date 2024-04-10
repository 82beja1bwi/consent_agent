// eslint-disable-next-line no-unused-vars
import PreferencesRepository from '../storage/preferences_repository.js'
// eslint-disable-next-line no-unused-vars
import Header from './models/header.js'
// eslint-disable-next-line no-unused-vars
import ScoredPreferences, { Issue } from './models/scored_preferences.js'

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
    const scoredPreferences = new ScoredPreferences().setConsent(
      new Issue().setRelevance(1).setResolutions({
        analytics: 0.2,
        marketing: 0.1,
        personalizedContent: 0.1,
        personalizedAds: 0.4,
        externalContent: 0.1,
        identification: 0.1
      })
    )
    // store
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
    let modified = false
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

    if (
      this.#siteHasDifferentConsentResolutions(
        requiredConsentKeys,
        actualConsentKeys
      )
    ) {
      this.#adaptUsersConsentResolutions(
        requiredConsentKeys,
        scoredPreferences.consent.resolutions
      )
      modified = true
    }

    if (
      this.#siteHasDifferentContentResolutions(
        sitesScoredPreferences,
        scoredPreferences
      )
    ) {
      this.#adaptUsersContentResolutions(
        sitesScoredPreferences.content.resolutions,
        scoredPreferences
      )
      modified = true
    }

    if (modified) {
      // UPDATE REPO
      this.preferenceRepository.setUsersPreferences(
        hostName,
        scoredPreferences
      )
    }

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
    const scoredPreferences = this.preferenceRepository.getSitesPreferences(
      hostName,
      is2C
    )

    return scoredPreferences
  }

  /**
   *
   * @param {String} hostName
   * @param {ScoredPreferences} preferences
   */
  setSitesPreferences (hostName, preferences) {
    this.preferenceRepository.setSitesPreferences(hostName, preferences)
  }

  #siteHasDifferentConsentResolutions = (
    requiredConsentKeys,
    actualConsentKeys
  ) => {
    return requiredConsentKeys.length < actualConsentKeys.length
  }

  #siteHasDifferentContentResolutions = (
    sitesScoredPreferences,
    scoredPreferences
  ) => {
    return (
      sitesScoredPreferences.content && !scoredPreferences.content?.resolutions
    )
  }

  #adaptUsersConsentResolutions = (requiredConsentKeys, usersResolutions) => {
    let pointsToBeSplit = 0
    Object.keys(usersResolutions).forEach((key) => {
      if (!requiredConsentKeys.includes(key)) {
        pointsToBeSplit += usersResolutions[key]
        delete usersResolutions[key]
      }
    })
    if (pointsToBeSplit > 0) {
      const l = requiredConsentKeys.length
      const points = pointsToBeSplit / l
      for (const key in usersResolutions) {
        const value = usersResolutions[key]
        usersResolutions[key] = Math.round((value + points) * 100) / 100
      }
    }
  }

  #adaptUsersContentResolutions = (
    sitesContentResolutions,
    scoredPreferences
  ) => {
    scoredPreferences.consent.relevance = 0.4
    const content = new Issue().setRelevance(0.6).setResolutions({})

    for (const key in sitesContentResolutions) {
      content.resolutions[key] = this.#usersContentFunction(key)
    }
    scoredPreferences.setContent(content)
  }

  #usersContentFunction = (xContenPercentage) => {
    // imitate a preference function for content options
    const points = new Map([
      [100, 1],
      [80, 0.9],
      [70, 0.7],
      [50, 0.5],
      [30, 0.1],
      [0, 0]
    ])

    if (points.has(xContenPercentage)) {
      return points.get(xContenPercentage)
    } else {
      for (const [key, value] of points) {
        if (parseInt(xContenPercentage) >= key) {
          return value
        }
      }
    }
  }
}
