import Interceptor from '../../../src/background/domain/interceptor.js'
import Contract from '../../../src/background/domain/models/contract.js'
import Header, { NegotiationStatus } from '../../../src/background/domain/models/header'
import Proposal from '../../../src/background/domain/models/proposal.js'

describe('Interceptor.js', () => {
  let contractRepositoryMock
  let proposalRepositoryMock
  let negotiatorMock

  beforeEach(() => {
    // Initialize a mock instance of PreferencesRepository
    contractRepositoryMock = {}
    proposalRepositoryMock = {
      setProposal: jest.fn(),
      getProposal: jest.fn()
    }
    negotiatorMock = {
      prepareCounteroffer: jest.fn(),
      couldBeAttractiveForUser: jest.fn()
    }

    // Create an instance of PreferenceManager with the mock repository
  })

  describe('onHeadersReceived', () => {
    test('If status is exchange, then return counter offer', async () => {
      const inputHeader = new Header().setStatus(NegotiationStatus.EXCHANGE)

      negotiatorMock.prepareCounteroffer.mockReturnValue(
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
      const inputHeader = new Header().setStatus(NegotiationStatus.NEGOTIATION).setConsent('blabla')

      negotiatorMock.prepareCounteroffer.mockReturnValue(
        new Header().setStatus(NegotiationStatus.NEGOTIATION)
      )
      negotiatorMock.couldBeAttractiveForUser.mockReturnValue(true)

      const cut = new Interceptor(
        contractRepositoryMock,
        proposalRepositoryMock,
        negotiatorMock
      )

      const result = await cut.onHeadersReceived(inputHeader, 'hostname1')

      expect(result).toEqual(new Proposal().setHostName('hostname1').setConsent('blabla').setUserHasAccepted(false))
      expect(negotiatorMock.couldBeAttractiveForUser).toHaveBeenCalledWith(inputHeader, 'hostname1')
      expect(negotiatorMock.prepareCounteroffer).toHaveBeenCalledTimes(0)
    })

    test('IF status is negotiation AND offer is not attractive, THEN return a counteroffer', async () => {
      const inputHeader = new Header()
        .setStatus(NegotiationStatus.NEGOTIATION)
        .setConsent('blabla')

      negotiatorMock.prepareCounteroffer.mockReturnValue(
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

      proposalRepositoryMock.getProposal.mockReturnValue(null)

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
          .setUserHasAccepted(false)
      )
      expect(negotiatorMock.couldBeAttractiveForUser).toHaveBeenCalledTimes(0)
      expect(negotiatorMock.prepareCounteroffer).toHaveBeenCalledTimes(0)
    })
    test('IF status is accepted AND unaccepted proposal exists, THEN return a proposal', async () => {
      const inputHeader = new Header()
        .setStatus(NegotiationStatus.ACCEPTED)
        .setConsent('blabla')

      proposalRepositoryMock.getProposal.mockReturnValue(new Proposal().setUserHasAccepted(false))

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
          .setUserHasAccepted(false)
      )
      expect(negotiatorMock.couldBeAttractiveForUser).toHaveBeenCalledTimes(0)
      expect(negotiatorMock.prepareCounteroffer).toHaveBeenCalledTimes(0)
    })
    test('IF status is accepted AND accepted proposal exists, THEN return a contract', async () => {
      const inputHeader = new Header()
        .setStatus(NegotiationStatus.ACCEPTED)
        .setConsent('blabla')

      proposalRepositoryMock.getProposal.mockReturnValue(
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
      )
      expect(negotiatorMock.couldBeAttractiveForUser).toHaveBeenCalledTimes(0)
      expect(negotiatorMock.prepareCounteroffer).toHaveBeenCalledTimes(0)
    })
  })
})
