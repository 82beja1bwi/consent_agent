import Consent from '../../../../src/background/domain/models/consent'
import Proposal from '../../../../src/background/domain/models/proposal'
import { Issue } from '../../../../src/background/domain/models/scored_preferences'

describe('Proposal', () => {
  describe('fromData', () => {
    test('From Data to instance', () => {
      const data = {
        hostName: 'example.com',
        consent: { analytics: true, marketing: true },
        content: 50,
        cost: 0,
        score: 0.9,
        userHasAccepted: true
      }

      // Expected Proposal instance
      const expectedProposal = new Proposal()
        .setHostName('example.com')
        .setConsent(new Consent().setAnalytics(true).setMarketing(true))
        .setContent(50)
        .setCost(0)
        .setScore(0.9)
        .setUserHasAccepted(true)

      // Call the fromData method
      const result = Proposal.fromData(data)

      // Assertions
      expect(result).toEqual(expectedProposal)
    })
  })
})
