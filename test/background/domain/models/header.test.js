import Consent from '../../../../src/background/domain/models/consent.js'
import Header from '../../../../src/background/domain/models/header.js'
import ScoredPreferences, { Issue } from '../../../../src/background/domain/models/scored_preferences.js'

describe('Header', () => {
  describe('toString', () => {
    test('should convert the instance to the String header value', () => {
      const instance = new Header()
        .setStatus('exchange')
        .setPreferences(
          new ScoredPreferences()
            .setCost(
              new Issue().setRelevance(0.2).setResolutions({
                100: 30,
                80: 20,
                50: 10
              })
            )
            .setConsent(
              new Issue().setRelevance(0.3).setResolutions({
                analytics: 10,
                marketing: 10,
                personalizedContent: 10,
                personalizedAds: 10,
                externalContent: 10,
                identification: 5
              })
            )
            .setContent(
              new Issue().setRelevance(0.5).setResolutions({
                2.99: 20,
                5.49: 10,
                7.19: 5
              })
            )
        )
        .setConsent(new Consent(true, true, true, true, true, true))
        .setCost(2)
        .setContent(90)

      expect(instance.toString()).toBe(
        'status=exchange preferences=eyJjb3N0Ijp7InJlbGV2YW5jZSI6MC4yLCJyZXNvbHV0aW9ucyI6eyI1MCI6MTAsIjgwIjoyMCwiMTAwIjozMH19LCJjb25zZW50Ijp7InJlbGV2YW5jZSI6MC4zLCJyZXNvbHV0aW9ucyI6eyJhbmFseXRpY3MiOjEwLCJtYXJrZXRpbmciOjEwLCJwZXJzb25hbGl6ZWRDb250ZW50IjoxMCwicGVyc29uYWxpemVkQWRzIjoxMCwiZXh0ZXJuYWxDb250ZW50IjoxMCwiaWRlbnRpZmljYXRpb24iOjV9fSwiY29udGVudCI6eyJyZWxldmFuY2UiOjAuNSwicmVzb2x1dGlvbnMiOnsiMi45OSI6MjAsIjUuNDkiOjEwLCI3LjE5Ijo1fX19 cost=2 consent=analytics marketing personalizedContent personalizedAds externalContent identification content=90'
      )
    })

    test('empty fields are not included in String header value', () => {
      const instance = new Header('exchange',
        null,
        new Consent(false, false, false, false, false, false, false, false),
        null,
        null
      )

      expect(instance.toString()).toBe('status=exchange')
    })
  })
  describe('fromString', () => {
    test('should create the instance from header string', () => {
      const input =
        'status=exchange preferences=eyJjb3N0Ijp7InJlbGV2YW5jZSI6MC4yLCJyZXNvbHV0aW9ucyI6eyI1MCI6MTAsIjgwIjoyMCwiMTAwIjozMH19LCJjb25zZW50Ijp7InJlbGV2YW5jZSI6MC4zLCJyZXNvbHV0aW9ucyI6eyJhbmFseXRpY3MiOjEwLCJtYXJrZXRpbmciOjEwLCJwZXJzb25hbGl6ZWRDb250ZW50IjoxMCwicGVyc29uYWxpemVkQWRzIjoxMCwiZXh0ZXJuYWxDb250ZW50IjoxMCwiaWRlbnRpZmljYXRpb24iOjV9fSwiY29udGVudCI6eyJyZWxldmFuY2UiOjAuNSwicmVzb2x1dGlvbnMiOnsiMi45OSI6MjAsIjUuNDkiOjEwLCI3LjE5Ijo1fX19= cost=2 consent=rejectAll acceptAll analytics marketing personalizedContent personalizedAds externalContent identification content=90'
      const actual = Header.fromString(input)

      expect(actual).toEqual(
        new Header()
          .setStatus('exchange')
          .setPreferences(
            new ScoredPreferences()
              .setCost(
                new Issue().setRelevance(0.2).setResolutions({
                  100: 30,
                  80: 20,
                  50: 10
                })
              )
              .setConsent(
                new Issue().setRelevance(0.3).setResolutions({
                  analytics: 10,
                  marketing: 10,
                  personalizedContent: 10,
                  personalizedAds: 10,
                  externalContent: 10,
                  identification: 5
                })
              )
              .setContent(
                new Issue().setRelevance(0.5).setResolutions({
                  2.99: 20,
                  5.49: 10,
                  7.19: 5
                })
              )
          )
          .setConsent(new Consent(true, true, true, true, true, true))
          .setCost(2)
          .setContent(90)
      )
    })
  })
})
