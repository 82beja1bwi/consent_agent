import Calculator from '../../../src/background/domain/calculator'
import Consent from '../../../src/background/domain/models/consent'
import Header from '../../../src/background/domain/models/header'
import ScoredPreferences, { Issue } from '../../../src/background/domain/models/scored_preferences'

/* eslint-disable no-undef */
describe('Calculator', () => {
  describe('calcSitesScoringFunction', () => {
    test('If wrong data model then throw Error', () => {
      const scoredPreferences = { }
      const cut = new Calculator()
      expect(() => {
        cut.calcSitesScoringFunction(scoredPreferences)
      }).toThrow(
        new Error('Preferences must be in data model ScoredPreferences')
      )
    })
    test('if not enough bools provded, then throw error', () => {
      const scoredPreferences = new ScoredPreferences()
        .setConsent(
          new Issue().setRelevance(0.4).setResolutions({
            analytics: 0.3,
            marketing: 0.5,
            personalizedAds: 0.2
          })
        )
        .setContent(
          new Issue().setRelevance(0.6).setResolutions({
            100: 1,
            70: 0.6
          })
        )

      const cut = new Calculator()
      const actual = cut.calcSitesScoringFunction(scoredPreferences)

      expect(() => {
        actual([true, false], 1, null)
      }).toThrow(new Error('Not enough bools provided'))
    })

    test('2C && site: prefernces (consent, content) should return respective function', () => {
      const scoredPreferences = new ScoredPreferences()
        .setConsent(
          new Issue()
            .setRelevance(0.4)
            .setResolutions({
              analytics: 0.3,
              marketing: 0.5,
              personalizedAds: 0.2
            })
        )
        .setContent(
          new Issue()
            .setRelevance(0.6)
            .setResolutions({
              100: 1,
              70: 0.6
            })
        )

      const cut = new Calculator()
      const actual = cut.calcSitesScoringFunction(scoredPreferences)

      expect(actual([true, false, false], 1, null)).toEqual(72)
    })

    test('3C && site: preferences (cost, consent, content) should return respective function', () => {
      const scoredPreferences = new ScoredPreferences()
        .setCost(
          new Issue().setRelevance(0.4).setResolutions({
            5: 1,
            1: 0.2
          })
        )
        .setConsent(
          new Issue().setRelevance(0.2).setResolutions({
            analytics: 0.3,
            marketing: 0.5,
            personalizedAds: 0.2
          })
        )
        .setContent(
          new Issue().setRelevance(0.4).setResolutions({
            100: 1,
            70: 0.9
          })
        )

      const cut = new Calculator()
      const actual = cut.calcSitesScoringFunction(scoredPreferences)

      expect(actual([true, false, false], 1, 1)).toEqual(86)
    })
  })
  describe('initUsersScoringFunction', () => {
    test('If wrong data model then throw Error', () => {
      const scoredPreferences = { }
      const cut = new Calculator()
      expect(() => {
        cut.calcUsersScoringFunction(scoredPreferences)
      }).toThrow(new Error('Preferences must be in data model ScoredPreferences'))
    })
  })

  describe('initUsersScoringFunction', () => {
    test('if not enough bools provded, then throw error', () => {
      const scoredPreferences = new ScoredPreferences()
        .setConsent(
          new Issue().setRelevance(0.4).setResolutions({
            analytics: 0.3,
            marketing: 0.5,
            personalizedAds: 0.2
          })
        )
        .setContent(
          new Issue().setRelevance(0.6).setResolutions({
            100: 1,
            70: 0.6
          })
        )
      const cut = new Calculator()
      const actual = cut.calcUsersScoringFunction(scoredPreferences)

      expect(() => {
        actual([true, false], 1, null)
      }).toThrow(new Error('Not enough bools provided'))
    })

    test('2C && user: prefernces (consent, content) should return respective function', () => {
      const scoredPreferences = new ScoredPreferences()
        .setConsent(
          new Issue().setRelevance(0.4).setResolutions({
            analytics: 0.3,
            marketing: 0.5,
            personalizedAds: 0.2
          })
        )
        .setContent(
          new Issue().setRelevance(0.6).setResolutions({
            100: 1,
            70: 0.6
          })
        )
      const cut = new Calculator()
      const actual = cut.calcUsersScoringFunction(scoredPreferences)

      expect(actual([true, false, false], 1, null)).toEqual(
        88
      )
    })

    test('3C && user: preferences (cost, consent, content) should return respective function', () => {
      const scoredPreferences = new ScoredPreferences()
        .setCost(
          new Issue().setRelevance(0.4).setResolutions({
            5: 1,
            1: 0.2
          })
        )
        .setConsent(
          new Issue().setRelevance(0.2).setResolutions({
            analytics: 0.3,
            marketing: 0.5,
            personalizedAds: 0.2
          })
        )
        .setContent(
          new Issue().setRelevance(0.4).setResolutions({
            100: 1,
            70: 0.9
          })
        )

      const cut = new Calculator()
      const actual = cut.calcUsersScoringFunction(scoredPreferences)

      expect(actual([true, false, false], 1, 1)).toEqual(94)
    })
  })

  describe('calcNashOptimalContract', () => {
    test('For 2C preferences (content, consent) calculate nash optimal contract', () => {
      const usersScoredPreferences = new ScoredPreferences()
      usersScoredPreferences.consent = {
        relevance: 0.4,
        resolutions: {
          analytics: 0.3,
          marketing: 0.5,
          personalizedAds: 0.2
        }
      }
      usersScoredPreferences.content = {
        relevance: 0.6,
        resolutions: {
          100: 1,
          70: 0.9
        }
      }
      const sitesScoredPreferences = new ScoredPreferences()
      sitesScoredPreferences.consent = {
        relevance: 0.6,
        resolutions: {
          analytics: 0.3,
          marketing: 0.5,
          personalizedAds: 0.2
        }
      }
      sitesScoredPreferences.content = {
        relevance: 0.4,
        resolutions: {
          100: 1,
          70: 0.6
        }
      }
      const cut = new Calculator()
      const usersScoringFunction = cut.calcUsersScoringFunction(usersScoredPreferences)
      const sitesScoringFunction = cut.calcSitesScoringFunction(sitesScoredPreferences)

      const expectedConsent = new Consent()
      expectedConsent.analytics = true
      expectedConsent.marketing = true
      expectedConsent.personalizedAds = true

      expect(cut.calcNashContract(usersScoredPreferences, sitesScoredPreferences, usersScoringFunction, sitesScoringFunction))
        .toEqual(new Header().setConsent(expectedConsent).setCost('0').setContent('100')
        )
    })
    test('For 3C preferences (cost,content, consent) calculate nash optimal contract', () => {
      const usersScoredPreferences = new ScoredPreferences()
      usersScoredPreferences.cost = {
        relevance: 0.4,
        resolutions: {
          0: 1,
          2: 0.75,
          9: 0.25
        }
      }
      usersScoredPreferences.consent = {
        relevance: 0.2,
        resolutions: {
          analytics: 0.2,
          marketing: 0.1,
          personalizedAds: 0.7
        }
      }
      usersScoredPreferences.content = {
        relevance: 0.4,
        resolutions: {
          100: 1,
          70: 0.75
        }
      }
      const sitesScoredPreferences = new ScoredPreferences()
      sitesScoredPreferences.cost = {
        relevance: 0.5,
        resolutions: {
          0: 0.2,
          2: 0.6,
          9: 1
        }
      }
      sitesScoredPreferences.consent = {
        relevance: 0.2,
        resolutions: {
          analytics: 0.3,
          marketing: 0.2,
          personalizedAds: 0.5
        }
      }
      sitesScoredPreferences.content = {
        relevance: 0.3,
        resolutions: {
          100: 1,
          70: 0.5
        }
      }
      const cut = new Calculator()
      const usersScoringFunction = cut.calcUsersScoringFunction(usersScoredPreferences)
      const sitesScoringFunction = cut.calcSitesScoringFunction(sitesScoredPreferences)

      const expectedConsent = new Consent()
      expectedConsent.analytics = true
      expectedConsent.marketing = true
      expectedConsent.personalizedAds = false

      expect(cut.calcNashContract(usersScoredPreferences, sitesScoredPreferences, usersScoringFunction, sitesScoringFunction))
        .toEqual(
          new Header().setConsent(expectedConsent).setCost('2').setContent('100'))
    })
  })
})