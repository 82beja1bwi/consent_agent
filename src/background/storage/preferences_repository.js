// eslint-disable-next-line no-unused-vars
import ScoredPreferences from '../domain/models/scored_preferences/scored_preferences.js'

export default class PreferencesRepository {
  constructor () {
    this.sitesPreferences = new Map()
    this.usersPreferences = new Map()
  }

  getUsersDefaultConsentPreferences () {
    return {
      analytics: 0.2,
      marketing: 0.1,
      personalizedContent: 0.1,
      personalizedAds: 0.4,
      externalContent: 0.1,
      identification: 0.1
    }
  }

  /**
   *
   * @param {String} hostName
   * @param {Boolean} is2C
   * @returns {ScoredPreferences | null}
   */
  getUsersPreferences (hostName, is2C) {
    const pref = this.usersPreferences.get(hostName)

    if (!pref) return null

    if (is2C) {
      return pref[0]
    } else {
      return pref[1] || null
    }
  }

  /**
   *
   * @param {String} hostName
   * @param {Boolean} is2C
   * @returns {ScoredPreferences | null}
   */
  getSitesPreferences (hostName, is2C) {
    const pref = this.sitesPreferences.get(hostName)

    if (!pref) return null

    if (is2C) {
      return pref[0]
    } else {
      return pref[1] || null
    }
  }

  /**
   *
   * @param {String} hostName
   * @param {ScoredPreferences} scoredPreferences
   */
  setUsersPreferences (hostName, scoredPreferences) {
    if (this.usersPreferences.has(hostName)) {
      const temp = this.usersPreferences.get(hostName)
      this.usersPreferences.set(hostName, { temp, scoredPreferences })
    } else {
      this.usersPreferences.set(hostName, scoredPreferences)
    }
  }

  /**
   *
   * @param {String} hostName
   * @param {ScoredPreferences} scoredPreferences
   */
  setSitesPreferences (hostName, scoredPreferences) {
    if (this.sitesPreferences.has(hostName)) {
      const temp = this.sitesPreferences.get(hostName)
      this.sitesPreferences.set(hostName, { temp, scoredPreferences })
    } else {
      this.sitesPreferences.set(hostName, scoredPreferences)
    }
  }
}
