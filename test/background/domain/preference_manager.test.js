import ScoredPreferences from '../../../src/background/domain/models/scored_preferences/scored_preferences'
import PreferenceManager from '../../../src/background/domain/preference_manager'
import PreferencesRepository from '../../../src/background/storage/preferences_repository'

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
  })
})
