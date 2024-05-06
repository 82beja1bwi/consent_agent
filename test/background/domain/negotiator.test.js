import Consent from '../../../src/background/domain/models/consent'
import Header from '../../../src/background/domain/models/header'
import Negotiator from '../../../src/background/domain/negotiator'

describe('negotiator.js', () => {
  /* beforeEach(() => {
    // Initialize a mock instance of PreferencesRepository
    contractRepositoryMock = {}
    proposalRepositoryMock = {
      setProposal: jest.fn(),
      getProposal: jest.fn()
    }
    preferenceManagerMock = {
      createUsers3CPreferences: jest.fn()
    }

    negotiatorMock = {
      prepareCounteroffer: jest.fn(),
      couldBeAttractiveForUser: jest.fn()
    }

    // Create an instance of PreferenceManager with the mock repository
  }) */

  describe('couldBeAttractiveForUser', () => {
    test('handles consent equals', async () => {
      const optimalContract = new Header().setConsent(
        new Consent().setAnalytics(true)
      )
      Negotiator.prototype.prepareCounteroffer = jest.fn(() => {
        // Define the behavior of the mocked method
        // For example, return a predefined contract object
        return optimalContract
      })

      const cut = new Negotiator()
      const header = new Header().setConsent(new Consent().setAnalytics(true))
      const hostname = 'bla'

      expect(cut.couldBeAttractiveForUser(header, hostname)).toBe(true)
    })
    test('handles cost equals', async () => {
      const optimalContract = new Header().setCost(1)
      Negotiator.prototype.prepareCounteroffer = jest.fn(() => {
        // Define the behavior of the mocked method
        // For example, return a predefined contract object
        return optimalContract
      })

      const cut = new Negotiator()
      const header = new Header().setCost('1')
      const hostname = 'bla'

      expect(cut.couldBeAttractiveForUser(header, hostname)).toBe(true)
    })
    test('handles content equals', async () => {
      const optimalContract = new Header().setContent(100)
      Negotiator.prototype.prepareCounteroffer = jest.fn(() => {
        // Define the behavior of the mocked method
        // For example, return a predefined contract object
        return optimalContract
      })

      const cut = new Negotiator()
      const header = new Header().setContent('100')
      const hostname = 'bla'

      expect(cut.couldBeAttractiveForUser(header, hostname)).toBe(true)
    })
  })
})
