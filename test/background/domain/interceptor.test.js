import Interceptor from '../../../src/background/domain/interceptor.js'
import Header, { NegotiationStatus } from '../../../src/background/domain/models/header'
import Negotiator from '../../../src/background/domain/negotiator.js'
import ContractRepository from '../../../src/background/storage/contracts_repository.js'
import ProposalRepository from '../../../src/background/storage/proposalRepository.js'

describe('Interceptor.js', () => {
  let contractRepositoryMock
  let proposalRepositoryMock
  let negotiatorMock

  beforeEach(() => {
    // Initialize a mock instance of PreferencesRepository
    contractRepositoryMock = {}
    proposalRepositoryMock = {}
    negotiatorMock = {
      prepareCounteroffer: jest.fn()
    }

    // Create an instance of PreferenceManager with the mock repository
  })

  describe('onHeadersReceived', () => {
    test('If status is exchange, then return counter offer', async () => {
      const inputHeader = new Header().setStatus(NegotiationStatus.EXCHANGE)

      negotiatorMock.prepareCounteroffer.mockReturnValue(
        new Header()
      )

      const cut = new Interceptor(
        contractRepositoryMock,
        proposalRepositoryMock,
        negotiatorMock
      )

      const result = await cut.onHeadersReceived(inputHeader)

      expect(
        result
      ).toEqual(new Header()
      )
    })
  })
})
