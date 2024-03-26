import ScoredConsentPreferences from '../domain/models/scored_preferences/scored_consent_preferences.js'
// import Contract from '../models/contract.js'

// let preferences

export function getScoredConsentPreferences () {
  // default ist zunaechst hier
  return new ScoredConsentPreferences(20, 0, 5, 5, 10, 5, 10, 0)
}

export function setPreferences (preferences) {
  /* if (preferences instanceof Contract) {
    contracts[baseURL] = contract
    console.log('Contract stored for ', contract.baseURL)
  } */
}
