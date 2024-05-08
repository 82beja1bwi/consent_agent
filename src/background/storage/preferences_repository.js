// eslint-disable-next-line no-unused-vars
import ScoredPreferences from '../domain/models/scored_preferences.js'

export default class PreferenceRepository {
  /**
   *
   *
   * @param {String} hostName
   * @param {Boolean} is2C
   * @returns ScoredPreferences | null
   */
  async getUsersPreferences (hostName, is2C) {
    const storageData = await browser.storage.local.get('user_preferences')
    const prefs = storageData.user_preferences || {} // If proposals object doesn't exist, initialize it as an empty object
    const pref = prefs[hostName] || null
    console.log(pref)

    if (!pref) return null

    if (is2C) {
      console.log('REPO GOT User Pref: ', ScoredPreferences.fromData(pref[0]))

      return ScoredPreferences.fromData(pref[0])
    } else {
      console.log('REPO GOT User Pref: ', ScoredPreferences.fromData(pref[1]))

      return ScoredPreferences.fromData(pref[1]) || null
    }

    // return Proposal.fromData(proposals[hostName]) || null

    // const pref = usersPreferences.get(hostName)

    // if (!pref) return null

    // if (is2C) {
    //   return pref[0]
    // } else {
    //   return pref[1] || null
    // }
  }

  /**
   *
   * @param {String} hostName
   * @param {Boolean} is2C
   * @returns ScoredPreferences | null
   */
  async getSitesPreferences (hostName, is2C) {
    console.log('-GET SITES PREFS for Host', hostName, is2C)
    const storageData = await browser.storage.local.get('sites_preferences')
    console.log('storage data', storageData)
    const prefs = storageData.sites_preferences || {} // If proposals object doesn't exist, initialize it as an empty object
    console.log('prefs', prefs)
    const pref = prefs[hostName] || null
    console.log('pref', pref)

    if (!pref) return null

    if (is2C) {
      console.log('PREF: ', ScoredPreferences.fromData(pref[0]))

      return ScoredPreferences.fromData(pref[0])
    } else {
      console.log('PREF: ', ScoredPreferences.fromData(pref[1]))

      return ScoredPreferences.fromData(pref[1]) || null
    }

    // const pref = sitesPreferences.get(hostName)

    // if (!pref) return null

    // if (is2C) {
    //   return pref[0]
    // } else {
    //   return pref[1] || null
    // }
  }

  async setUsers2CPrefs (hostname, scoredPreferences) {
    const storageData = await browser.storage.local.get('user_preferences')
    const prefs = storageData.prefs || {} // If proposals object doesn't exist, initialize it as an empty object

    prefs[hostname] = [scoredPreferences]

    await browser.storage.local.set({ user_preferences: prefs })

    // usersPreferences.set(hostname, [scoredPreferences])
  }

  async setUsers3CPrefs (hostname, scoredPreferences) {
    console.log('CREATING 3C prefs for HOST', hostname, scoredPreferences)
    // const storageData = await browser.storage.local.get("user_preferences");
    // const prefs = storageData.user_preferences || {}; // If proposals object doesn't exist, initialize it as an empty object
    // const pref = prefs[hostName] || null;
    // console.log(pref);
    const storageData = await browser.storage.local.get('user_preferences')
    const prefs = storageData.user_preferences || {} // If proposals object doesn't exist, initialize it as an empty object

    console.log('PUSH 3C USER PREFS', scoredPreferences, 'into', prefs[hostname])
    const pref = prefs[hostname] || null
    pref?.push(scoredPreferences)
    console.log('RESULTING', pref, 'IN', prefs[hostname])

    await browser.storage.local.set({ user_preferences: prefs })

    // const temp = usersPreferences.get(hostname)

    // usersPreferences.set(hostname, [temp[0], scoredPreferences])
  }

  /**
   *
   * @param {String} hostName
   * @param {[ScoredPreferences]} scoredPreferences
   */
  async setSitesPreferences (hostName, scoredPreferences) {
    // sitesPreferences.set(hostName, scoredPreferences)
    const storageData = await browser.storage.local.get('sites_preferences')
    const prefs = storageData.prefs || {} // If proposals object doesn't exist, initialize it as an empty object

    prefs[hostName] = scoredPreferences

    await browser.storage.local.set({ sites_preferences: prefs })
  }
}
// export default class PreferenceRepository {
//   constructor () {
//     this.sitesPreferences = new Map()
//     this.usersPreferences = new Map()
//   }

//   /**
//    *
//    * @param {String} hostName
//    * @param {Boolean} is2C
//    * @returns {ScoredPreferences | null}
//    */
//   getUsersPreferences (hostName, is2C) {
//     const pref = this.usersPreferences.get(hostName)
//     console.log(' REPO: pref: ', pref, ' of host ', hostName)

//     if (!pref) return null

//     if (is2C) {
//       return pref[0]
//     } else {
//       return pref[1] || null
//     }
//   }

//   /**
//    *
//    * @param {String} hostName
//    * @param {Boolean} is2C
//    * @returns {ScoredPreferences | null}
//    */
//   getSitesPreferences (hostName, is2C) {
//     const pref = this.sitesPreferences.get(hostName)

//     if (!pref) return null

//     if (is2C) {
//       return pref[0]
//     } else {
//       return pref[1] || null
//     }
//   }

//   setUsers2CPrefs (hostname, scoredPreferences) {
//     this.usersPreferences.set(hostname, [scoredPreferences])
//   }

//   setUsers3CPrefs (hostname, scoredPreferences) {
//     const temp = this.usersPreferences.get(hostname)

//     this.usersPreferences.set(hostname, [temp[0], scoredPreferences])
//   }

//   /**
//    *
//    * @param {String} hostName
//    * @param {[ScoredPreferences]} scoredPreferences
//    */
//   setSitesPreferences (hostName, scoredPreferences) {
//     this.sitesPreferences.set(hostName, scoredPreferences)
//     console.log(this.sitesPreferences)
//   }
// }
