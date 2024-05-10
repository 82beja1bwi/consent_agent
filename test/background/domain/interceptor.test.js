import Interceptor from '../../../src/background/domain/interceptor.js'
import Consent from '../../../src/background/domain/models/consent.js'
import Contract from '../../../src/background/domain/models/contract.js'
import Header, { NegotiationStatus } from '../../../src/background/domain/models/header'
import Proposal from '../../../src/background/domain/models/proposal.js'

describe('Interceptor.js', () => {
  let contractRepositoryMock
  let proposalRepositoryMock
  let negotiatorMock
  let preferenceManagerMock

  beforeEach(() => {
    // Initialize a mock instance of PreferencesRepository
    contractRepositoryMock = {
      getContract: jest.fn(),
      setContract: jest.fn()
    }
    proposalRepositoryMock = {
      setProposal: jest.fn(),
      getProposal: jest.fn()
    }
    preferenceManagerMock = {
      createUsers3CPreferences: jest.fn(),
      initUsersPreferences: jest.fn()
    }

    negotiatorMock = {
      prepareCounteroffer: jest.fn(),
      couldBeAttractiveForUser: jest.fn(),
      prepareInitialOffer: jest.fn()
    }

    // Create an instance of PreferenceManager with the mock repository
  })

  describe('handleUpdatedCostPreferences', () => {
    it('should return a Header object with correct status and preferences', async () => {
      // Arrange

      const hostname = 'example.com'
      // keys are cost resolutions e.g. 0 is 0 EUR, value is grade (german 1 best, 6 worst)
      const resolutions = {
        0: 6,
        2: 5,
        4: 4,
        9: 3,
        10: 2,
        20: 1
      }
      preferenceManagerMock.createUsers3CPreferences.mockResolvedValue('prefs')

      const cut = new Interceptor(contractRepositoryMock, proposalRepositoryMock, negotiatorMock, preferenceManagerMock)
      // Act
      const result = await cut.handleUpdatedCostPreferences(
        hostname,
        resolutions
      )

      // Assert
      expect(
        preferenceManagerMock.createUsers3CPreferences
      ).toHaveBeenCalledWith(hostname, {
        0: 1,
        2: 0.8,
        4: 0.6,
        9: 0.4,
        10: 0.2,
        20: 0
      })
      expect(result).toBeInstanceOf(Header)
      expect(result.status).toBe(NegotiationStatus.EXCHANGE)
      expect(result.preferences).toBe('prefs') // Check if the preferences are set correctly
    })
  })

  describe('onBeforeSendHeaders', () => {
    test('IF a contract was found THEN return null', async () => {
      contractRepositoryMock.getContract.mockResolvedValue(
        new Contract()
      )

      const cut = new Interceptor(contractRepositoryMock)

      const actual = await cut.onBeforeSendHeaders('hostname1')

      expect(actual).toBe(null)
    })
    test('IF no contract was found THEN return modified header and store initial contract', async () => {
      contractRepositoryMock.getContract.mockResolvedValue(null)
      preferenceManagerMock.initUsersPreferences.mockResolvedValue(true)
      negotiatorMock.prepareInitialOffer.mockReturnValue(new Header().setStatus(NegotiationStatus.EXCHANGE).setConsent(new Consent()))
      contractRepositoryMock.setContract.mockResolvedValue(true)

      const cut = new Interceptor(contractRepositoryMock, null, negotiatorMock, preferenceManagerMock)

      const actual = await cut.onBeforeSendHeaders('hostname1')

      expect(actual).toEqual(new Header().setStatus(NegotiationStatus.EXCHANGE).setConsent(new Consent()))
    })
  })

  describe('onHeadersReceived', () => {
    test('If status is exchange, then return counter offer', async () => {
      const inputHeader = new Header().setStatus(NegotiationStatus.EXCHANGE)

      negotiatorMock.prepareCounteroffer.mockResolvedValue(
        new Header().setStatus(NegotiationStatus.NEGOTIATION)
      )

      const cut = new Interceptor(
        contractRepositoryMock,
        proposalRepositoryMock,
        negotiatorMock
      )

      const result = await cut.onHeadersReceived(inputHeader, 'hostname1')

      expect(result).toEqual(
        new Header().setStatus(NegotiationStatus.NEGOTIATION)
      )
      expect(negotiatorMock.prepareCounteroffer).toHaveBeenCalled()
    })

    test('IF status is negotiation AND offer could be atrractive, THEN return a proposal', async () => {
      const inputHeader = new Header().setStatus(NegotiationStatus.NEGOTIATION).setConsent('blabla').setContent(60)

      negotiatorMock.prepareCounteroffer.mockResolvedValue(
        new Header().setStatus(NegotiationStatus.NEGOTIATION)
      )
      negotiatorMock.couldBeAttractiveForUser.mockReturnValue(true)

      const cut = new Interceptor(
        contractRepositoryMock,
        proposalRepositoryMock,
        negotiatorMock
      )

      const result = await cut.onHeadersReceived(inputHeader, 'hostname1')

      expect(result).toEqual(new Proposal().setHostName('hostname1').setConsent('blabla').setUserHasAccepted(false).setContent(60).setCost(0))
      expect(negotiatorMock.couldBeAttractiveForUser).toHaveBeenCalledWith(inputHeader, 'hostname1')
      expect(negotiatorMock.prepareCounteroffer).toHaveBeenCalledTimes(0)
    })

    test('IF status is negotiation AND offer is not attractive, THEN return a counteroffer', async () => {
      const inputHeader = new Header()
        .setStatus(NegotiationStatus.NEGOTIATION)
        .setConsent('blabla')

      negotiatorMock.prepareCounteroffer.mockResolvedValue(
        new Header().setStatus(NegotiationStatus.NEGOTIATION)
      )
      negotiatorMock.couldBeAttractiveForUser.mockReturnValue(false)

      const cut = new Interceptor(
        contractRepositoryMock,
        proposalRepositoryMock,
        negotiatorMock
      )

      const result = await cut.onHeadersReceived(inputHeader, 'hostname1')

      expect(result).toEqual(
        new Header()
          .setStatus(NegotiationStatus.NEGOTIATION)
      )
      expect(negotiatorMock.prepareCounteroffer).toHaveBeenCalledTimes(1)
      expect(negotiatorMock.couldBeAttractiveForUser).toHaveBeenCalledTimes(1)
    })

    test('IF status is accepted AND no proposal has been made yet, THEN return a proposal', async () => {
      const inputHeader = new Header()
        .setStatus(NegotiationStatus.ACCEPTED)
        .setConsent('blabla')
        .setContent(60)

      proposalRepositoryMock.getProposal.mockResolvedValue(null)

      const cut = new Interceptor(
        contractRepositoryMock,
        proposalRepositoryMock,
        negotiatorMock
      )

      const result = await cut.onHeadersReceived(inputHeader, 'hostname1')

      expect(result).toEqual(
        new Proposal()
          .setHostName('hostname1')
          .setConsent('blabla')
          .setContent(60)
          .setCost(0)
          .setUserHasAccepted(false)
      )
      expect(negotiatorMock.couldBeAttractiveForUser).toHaveBeenCalledTimes(0)
      expect(negotiatorMock.prepareCounteroffer).toHaveBeenCalledTimes(0)
    })
    test('IF status is accepted AND unaccepted proposal exists, THEN return a proposal', async () => {
      const inputHeader = new Header()
        .setStatus(NegotiationStatus.ACCEPTED)
        .setConsent('blabla')
        .setContent(60)

      proposalRepositoryMock.getProposal.mockResolvedValue(
        new Proposal().setUserHasAccepted(false)
      )

      const cut = new Interceptor(
        contractRepositoryMock,
        proposalRepositoryMock,
        negotiatorMock
      )

      const result = await cut.onHeadersReceived(inputHeader, 'hostname1')

      expect(result).toEqual(
        new Proposal()
          .setHostName('hostname1')
          .setConsent('blabla')
          .setContent(60)
          .setCost(0)
          .setUserHasAccepted(false)
      )
      expect(negotiatorMock.couldBeAttractiveForUser).toHaveBeenCalledTimes(0)
      expect(negotiatorMock.prepareCounteroffer).toHaveBeenCalledTimes(0)
    })
    test('IF status is accepted AND accepted proposal exists, THEN return a contract', async () => {
      const inputHeader = new Header()
        .setStatus(NegotiationStatus.ACCEPTED)
        .setConsent('blabla')
        .setContent(60)

      proposalRepositoryMock.getProposal.mockResolvedValue(
        new Proposal().setUserHasAccepted(true)
      )

      const cut = new Interceptor(
        contractRepositoryMock,
        proposalRepositoryMock,
        negotiatorMock
      )

      const result = await cut.onHeadersReceived(inputHeader, 'hostname1')

      expect(result).toEqual(
        new Contract()
          .setHostName('hostname1')
          .setConsent('blabla')
          .setContent(60)
          .setCost(0)
      )
      expect(negotiatorMock.couldBeAttractiveForUser).toHaveBeenCalledTimes(0)
      expect(negotiatorMock.prepareCounteroffer).toHaveBeenCalledTimes(0)
    })
  })
})
