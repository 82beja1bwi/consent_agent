// eslint-disable-next-line no-unused-vars
import ScoredPreferences from '../domain/models/scored_preferences.js'

export default class PreferenceRepository {
  constructor () {
    this.sitesPreferences = new Map()
    this.usersPreferences = new Map()
  }

  /**
   *
   * @param {String} hostName
   * @param {Boolean} is2C
   * @returns {ScoredPreferences | null}
   */
  getUsersPreferences (hostName, is2C) {
    const pref = this.usersPreferences.get(hostName)
    console.log(' REPO: pref: ', pref, ' of host ', hostName)

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

  setUsers2CPrefs (hostname, scoredPreferences) {
    this.usersPreferences.set(hostname, [scoredPreferences])
  }

  setUsers3CPrefs (hostname, scoredPreferences) {
    const temp = this.usersPreferences.get(hostname)

    this.usersPreferences.set(hostname, [temp[0], scoredPreferences])
  }

  /**
   *
   * @param {String} hostName
   * @param {[ScoredPreferences]} scoredPreferences
   */
  setSitesPreferences (hostName, scoredPreferences) {
    this.sitesPreferences.set(hostName, scoredPreferences)
    console.log(this.sitesPreferences)
  }
}
