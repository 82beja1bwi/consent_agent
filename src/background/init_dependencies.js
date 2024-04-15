import BadgeTextManager from './badge_text_manager.js'
import Calculator from './domain/calculator.js'
import Interceptor from './domain/interceptor.js'
import Negotiator from './domain/negotiator.js'
import PreferenceManager from './domain/preference_manager.js'
import ContractRepository from './storage/contracts_repository.js'
import PreferenceRepository from './storage/preferences_repository.js'
import ProposalRepository from './storage/proposalRepository.js'

// Repositories
const proposalRepository = new ProposalRepository()
const contractRepository = new ContractRepository()
const preferenceRepository = new PreferenceRepository()

// Domain
const calculator = new Calculator()
const preferenceManager = new PreferenceManager(preferenceRepository)
const negotiator = new Negotiator(calculator, preferenceManager)
const interceptor = new Interceptor(contractRepository, proposalRepository, negotiator)
const badgeTextManager = new BadgeTextManager(proposalRepository)

// Export Dependencies
export { proposalRepository, contractRepository, badgeTextManager, interceptor }
