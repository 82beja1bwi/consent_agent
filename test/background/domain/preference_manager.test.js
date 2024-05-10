import ScoredPreferences, { Issue } from '../../../src/background/domain/models/scored_preferences.js'
import PreferenceManager from '../../../src/background/domain/preference_manager'

jest.mock('../../../src/background/storage/preferences_repository')

describe('PreferenceManager', () => {
  let preferenceRepositoryMock

  beforeEach(() => {
    // Initialize a mock instance of PreferencesRepository
    preferenceRepositoryMock = {
      getUsersPreferences: jest.fn(),
      getUsersDefaultConsentPreferences: jest.fn(),
      setUsers2CPreferences: jest.fn(),
      setUsers3CPreferences: jest.fn()
    }
  })

  describe('initUsersPreferences', () => {
    test('initializes user preferences for a site', async () => {
      const preferenceManager = new PreferenceManager(preferenceRepositoryMock)
      const hostName = 'example.com'

      // Mock the expected return value for getUsersDefaultConsentPreferences method
      const defaultConsentPreferences = {
        analytics: 0.2,
        marketing: 0.1,
        personalizedContent: 0.1,
        personalizedAds: 0.4,
        externalContent: 0.1,
        identification: 0.1
      }

      // Call the method to initialize user preferences
      const result = await preferenceManager.initUsersPreferences(hostName)

      expect(preferenceRepositoryMock.setUsers2CPreferences).toHaveBeenCalledWith(
        hostName,
        expect.any(ScoredPreferences)
      )

      // Verify that the returned value is an instance of ScoredPreferences
      const expected = new ScoredPreferences()
      expected.consent = new Issue().setRelevance(1).setResolutions(defaultConsentPreferences)

      expect(result).toEqual(expected)
    })
  })

  describe('createUsers3CPreferences', () => {
    test('add cost resolutions and modify relevance scores', async () => {
      const cut = new PreferenceManager(preferenceRepositoryMock)
      const costResolutions = { 0: 1, 2: 0.8, 5: 0.4, 9: 0 }

      preferenceRepositoryMock.getUsersPreferences.mockResolvedValue(
        new ScoredPreferences()
          .setConsent(new Issue().setRelevance(0.2))
          .setContent(new Issue().setRelevance(0.4))
      )

      const actual = await cut.createUsers3CPreferences('hostname1', costResolutions)

      expect(
        preferenceRepositoryMock.setUsers3CPreferences
      ).toHaveBeenCalledWith(
        'hostname1',
        new ScoredPreferences()
          .setCost(
            new Issue().setRelevance(0.4).setResolutions(costResolutions)
          )
          .setConsent(new Issue().setRelevance(0.2))
          .setContent(new Issue().setRelevance(0.4))
      )

      expect(
        actual
      ).toEqual(
        new ScoredPreferences()
          .setCost(new Issue().setRelevance(0.4).setResolutions(costResolutions))
          .setConsent(new Issue().setRelevance(0.2))
          .setContent(new Issue().setRelevance(0.4))
      )
    })
  })

  describe('getUsersPreferences', () => {
    test('if site preferences have less consen options than default, then reduce consent resolutions in users preferences',
      async () => {
        const preferenceManager = new PreferenceManager(
          preferenceRepositoryMock
        )

        const hostName = 'example.com'

        preferenceRepositoryMock.getUsersPreferences.mockResolvedValue(
          new ScoredPreferences().setConsent(
            new Issue().setRelevance(1).setResolutions({
              analytics: 0.35,
              marketing: 0.25,
              personalizedAds: 0.2,
              personalizedContent: 0.3
            })
          )
        )

        const sitesPrefs = new ScoredPreferences()
          .setConsent(
            new Issue().setRelevance(1)
              .setResolutions({
                analytics: 0.3,
                marketing: 0.3,
                personalizedAds: 0.3
              })
          )
        // Call the method to initialize user preferences
        const result = await preferenceManager.getUsersPreferences(
          hostName,
          true,
          sitesPrefs
        )

        // Verify that the setUsersPreferences method is called with the correct arguments
        expect(
          preferenceRepositoryMock.setUsers2CPreferences
        ).toHaveBeenCalledWith(hostName, expect.any(ScoredPreferences))

        // Verify that the returned value is an instance of ScoredPreferences
        const expected = new ScoredPreferences().setConsent(
          new Issue().setRelevance(1).setResolutions({
            analytics: 0.45,
            marketing: 0.35,
            personalizedAds: 0.3
          })
        )

        expect(result).toEqual(expected)
      })

    test('if user preferences doesnst have content resolutions, then calculate preferences for the proposed resolutions',
      async () => {
        const preferenceManager = new PreferenceManager(
          preferenceRepositoryMock
        )

        const hostName = 'example.com'

        const usersPreferences = new ScoredPreferences().setConsent(
          new Issue().setRelevance(1).setResolutions({ analytics: 1 })
        )

        preferenceRepositoryMock.getUsersPreferences.mockResolvedValue(
          usersPreferences
        )

        const sitesPrefs = new ScoredPreferences()
          .setConsent(new Issue().setRelevance(0.5).setResolutions({ analytics: 1 }))
          .setContent(
            new Issue().setRelevance(0.5).setResolutions({
              100: 1,
              80: 0.8,
              79: 0.6,
              70: 0.49,
              51: 0.4,
              50: 0.3,
              30: 0.2,
              20: 0.2
            })
          )

        // Call the method to initialize user preferences
        const result = await preferenceManager.getUsersPreferences(hostName, true, sitesPrefs)

        // Verify that the setUsersPreferences method is called with the correct arguments
        expect(
          preferenceRepositoryMock.setUsers2CPreferences
        ).toHaveBeenCalledWith(hostName, expect.any(ScoredPreferences))

        // Verify that the returned value is an instance of ScoredPreferences
        const expected = new ScoredPreferences()
          .setConsent(
            new Issue().setRelevance(0.4).setResolutions({ analytics: 1 })
          )
          .setContent(
            new Issue().setRelevance(0.6).setResolutions({
              100: 1,
              80: 0.9,
              79: 0.7,
              70: 0.7,
              51: 0.5,
              50: 0.5,
              30: 0.1,
              20: 0
            })
          )

        expect(result).toEqual(expected)
      })
  })
})
