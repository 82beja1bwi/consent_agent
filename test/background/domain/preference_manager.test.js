import ScoredPreferences from '../../../src/background/domain/models/scored_preferences.js'
import PreferenceManager from '../../../src/background/domain/preference_manager'
import PreferencesRepository from '../../../src/background/storage/preferences_repository.js'

jest.mock('../../../src/background/storage/preferences_repository')

describe('PreferenceManager', () => {
  let preferenceManager
  let preferenceRepositoryMock

  beforeEach(() => {
    // Initialize a mock instance of PreferencesRepository
    preferenceRepositoryMock = new PreferencesRepository()

    // Create an instance of PreferenceManager with the mock repository
    preferenceManager = new PreferenceManager(preferenceRepositoryMock)
  })

  describe('initUsersPreferences', () => {
    test('initializes user preferences for a site', () => {
      const hostName = 'example.com'

      // Mock the expected return value for getUsersDefaultConsentPreferences method
      const defaultConsentPreferences = {
        analytics: 0.3,
        marketing: 0.5,
        personalizedAds: 0.2
      }
      preferenceRepositoryMock.getUsersDefaultConsentPreferences.mockReturnValue(
        defaultConsentPreferences
      )

      // Call the method to initialize user preferences
      const result = preferenceManager.initUsersPreferences(hostName)

      // Verify that the setUsersPreferences method is called with the correct arguments
      expect(preferenceRepositoryMock.setUsersPreferences).toHaveBeenCalledWith(
        hostName,
        expect.any(ScoredPreferences)
      )

      // Verify that the returned value is an instance of ScoredPreferences
      const expected = new ScoredPreferences()
      expected.consent = {
        relevance: null,
        resolutions: defaultConsentPreferences
      }
      expect(result).toEqual(expected)
    })
  })

  describe('getUsersPreferences', () => {
    test('if site preferences have less consen options than default, then reduce consent resolutions in users preferences', () => {
      const hostName = 'example.com'

      preferenceRepositoryMock.getUsersPreferences.mockReturnValue(
        {
          consent: {
            relevance: 1,
            resolutions: {
              analytics: 0.35,
              marketing: 0.25,
              personalizedAds: 0.2,
              personalizedContent: 0.3
            }
          }
        }
      )

      // Call the method to initialize user preferences
      const result = preferenceManager.getUsersPreferences(hostName, true, {
        consent: {
          relevance: 1,
          resolutions: {
            analytics: 0.3,
            marketing: 0.3,
            personalizedAds: 0.3
          }
        }
      })

      // Verify that the setUsersPreferences method is called with the correct arguments
      /* expect(
        preferenceRepositoryMock.setUsersPreferences
      ).toHaveBeenCalledWith(hostName, expect.any(ScoredPreferences))
*/
      // Verify that the returned value is an instance of ScoredPreferences
      const expected = new ScoredPreferences()
      expected.consent = expect(result).toEqual({
        consent: {
          relevance: 1,
          resolutions: {
            analytics: 0.45,
            marketing: 0.35,
            personalizedAds: 0.3
          }
        }
      })
    })
    test('if user preferences doesnst have content resolutions, then calculate preferences for the proposed resolutions', () => {
      const hostName = 'example.com'

      const usersPreferences = new ScoredPreferences().setConsent({
        relevance: 1,
        resolutions: {
          analytics: 0.35,
          marketing: 0.25,
          personalizedAds: 0.2,
          personalizedContent: 0.3
        }
      })

      preferenceRepositoryMock.getUsersPreferences.mockReturnValue(
        usersPreferences
      )

      // Call the method to initialize user preferences
      const result = preferenceManager.getUsersPreferences(hostName, true, {
        consent: {
          relevance: 0.6,
          resolutions: {
            analytics: 0.3,
            marketing: 0.3,
            personalizedAds: 0.3
          }
        },
        content: {
          relevance: 0.4,
          resolutions: {
            100: 1,
            80: 0.8,
            79: 0.6,
            70: 0.49,
            51: 0.4,
            50: 0.3,
            30: 0.2,
            20: 0.2
          }
        }
      })

      // Verify that the setUsersPreferences method is called with the correct arguments
      expect(
        preferenceRepositoryMock.setUsersPreferences
      ).toHaveBeenCalledWith(hostName, expect.any(ScoredPreferences))

      // Verify that the returned value is an instance of ScoredPreferences
      const expected = new ScoredPreferences()
      expected.consent = expect(result).toEqual({
        consent: {
          relevance: 0.4,
          resolutions: {
            analytics: 0.45,
            marketing: 0.35,
            personalizedAds: 0.3
          }
        },
        content: {
          relevance: 0.6,
          resolutions: {
            100: 1,
            80: 0.9,
            79: 0.7,
            70: 0.7,
            51: 0.5,
            50: 0.5,
            30: 0.1,
            20: 0
          }
        }

      })
    })
  })
})
