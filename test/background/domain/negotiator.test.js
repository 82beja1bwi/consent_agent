import Consent from '../../../src/background/domain/models/consent'
import Contract from '../../../src/background/domain/models/contract'
import Header, { NegotiationStatus } from '../../../src/background/domain/models/header'
import ScoredPreferences, { Issue } from '../../../src/background/domain/models/scored_preferences'
import Negotiator from '../../../src/background/domain/negotiator'

describe('negotiator.js', () => {
  let mockPreferenceManager
  let mockCalculator
  beforeEach(() => {
    // Mock the dependencies of the NegotiationManager
    mockPreferenceManager = {
      getSitesPreferences: jest.fn(),
      setSitesPreferences: jest.fn(),
      getUsersPreferences: jest.fn()
    }

    mockCalculator = {
      calcUsersScoringFunction: jest.fn(),
      calcSitesScoringFunction: jest.fn(),
      calcNashContracts: jest.fn()
    }
  })

  describe('couldBeAttractiveForUser', () => {
    test('handles consent equals', async () => {
      const optimalContract = new Header().setConsent(
        new Consent().setAnalytics(true)
      )
      jest
        .spyOn(Negotiator.prototype, 'prepareCounteroffer')
        .mockReturnValueOnce(optimalContract)

      const cut = new Negotiator()
      const header = new Header().setConsent(new Consent().setAnalytics(true))
      const hostname = 'bla'

      const result = await cut.couldBeAttractiveForUser(header, hostname)

      expect(result).toBe(true)
    })
    test('handles cost equals', async () => {
      const optimalContract = new Header().setCost(1)
      jest
        .spyOn(Negotiator.prototype, 'prepareCounteroffer')
        .mockReturnValueOnce(optimalContract)

      const cut = new Negotiator()
      const header = new Header().setCost('1')
      const hostname = 'bla'

      const result = await cut.couldBeAttractiveForUser(header, hostname)

      expect(result).toBe(true)
    })
    test('handles content equals', async () => {
      const optimalContract = new Header().setContent(100)
      jest
        .spyOn(Negotiator.prototype, 'prepareCounteroffer')
        .mockReturnValueOnce(optimalContract)

      const cut = new Negotiator()
      const header = new Header().setContent('100')
      const hostname = 'bla'

      const result = await cut.couldBeAttractiveForUser(header, hostname)

      expect(result).toBe(true)
    })
    test('handles Cost, Consent, Content equals', async () => {
      const optimalContract = new Header()
        .setContent(100)
        .setConsent(new Consent().setAnalytics(true))
        .setCost(4)

      jest
        .spyOn(Negotiator.prototype, 'prepareCounteroffer')
        .mockReturnValueOnce(optimalContract)

      const cut = new Negotiator()
      const header = new Header()
        .setContent(100)
        .setConsent(new Consent().setAnalytics(true))
        .setCost(4)
      const hostname = 'bla'

      const result = await cut.couldBeAttractiveForUser(header, hostname)

      expect(result).toBe(true)
    })

    test('If cost doesnt equal return false', async () => {
      const optimalContract = new Header()
        .setContent(100)
        .setConsent(new Consent().setAnalytics(true))
        .setCost(2)

      jest
        .spyOn(Negotiator.prototype, 'prepareCounteroffer')
        .mockReturnValueOnce(optimalContract)

      const cut = new Negotiator()
      const header = new Header()
        .setContent(100)
        .setConsent(new Consent().setAnalytics(true))
        .setCost(4)
      const hostname = 'bla'

      const result = await cut.couldBeAttractiveForUser(header, hostname)

      expect(result).toBe(false)
    })
    test('If consent doesnt equal return false', async () => {
      const optimalContract = new Header()
        .setContent(100)
        .setConsent(new Consent().setAnalytics(false))
        .setCost(4)

      jest
        .spyOn(Negotiator.prototype, 'prepareCounteroffer')
        .mockReturnValueOnce(optimalContract)

      const cut = new Negotiator()
      const header = new Header()
        .setContent(100)
        .setConsent(new Consent().setAnalytics(true))
        .setCost(4)
      const hostname = 'bla'

      const result = await cut.couldBeAttractiveForUser(header, hostname)

      expect(result).toBe(false)
    })
    test('If content doesnt equal return false', async () => {
      const optimalContract = new Header()
        .setContent(80)
        .setConsent(new Consent().setAnalytics(false))
        .setCost(4)

      jest
        .spyOn(Negotiator.prototype, 'prepareCounteroffer')
        .mockReturnValueOnce(optimalContract)

      const cut = new Negotiator()

      const header = new Header()
        .setContent(100)
        .setConsent(new Consent().setAnalytics(true))
        .setCost(4)
      const hostname = 'bla'

      const result = await cut.couldBeAttractiveForUser(header, hostname)

      expect(result).toBe(false)
    })
  })

  describe('prepareCounterOffer', () => {
    test('for existing prefernces make calls to negotiator and return optimal contract', async () => {
      const input = new Header()
      input.status = NegotiationStatus.EXCHANGE
      input.preferences = null // already stored prefs
      input.cost = 0 // => is2C negotiation

      // Mock the return values of preferenceManager methods
      mockPreferenceManager.getSitesPreferences.mockResolvedValue(
        new ScoredPreferences()
      )
      mockPreferenceManager.getUsersPreferences.mockResolvedValue(
        new ScoredPreferences()
      )
      mockCalculator.calcSitesScoringFunction.mockReturnValue(() => {})
      mockCalculator.calcUsersScoringFunction.mockReturnValue(() => {})

      mockCalculator.calcNashContracts.mockReturnValue([
        new Contract().setHostName('hostname1').setConsent(new Consent().setIdentification(true)).setContent(100)
      ])

      // Create an instance of NegotiationManager with mocked dependencies
      const cut = new Negotiator(mockCalculator, mockPreferenceManager)

      // Call the prepareCounteroffer method
      const result = await cut.prepareCounteroffer(input, 'example.com')

      // Assertions
      expect(result).toEqual(new Header()
        .setStatus(NegotiationStatus.NEGOTIATION)
        .setConsent(new Consent().setIdentification(true))
        .setContent(100)
        .setCost(undefined)
        .setPreferences(new ScoredPreferences())
      )
    })
  })
})
