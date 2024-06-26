/* eslint-disable no-undef */

import ScoredPreferences, { Issue } from '../../../../src/background/domain/models/scored_preferences.js'

describe('ScoredPreferences', () => {
  describe('toBase64EncodedString', () => {
    test('should deserialize 2C preferences an instance to a base64 encoded JSON', () => {
      const scoredPreferences = new ScoredPreferences()

      scoredPreferences.setConsent(new Issue().setRelevance(0.5).setResolutions({ analytics: 1 }))
      scoredPreferences.setContent(new Issue().setRelevance(0.5).setResolutions({ 100: 1 }))

      const actual = scoredPreferences.toBase64EncodedJSON()

      expect(atob(actual)).toBe('{"consent":{"relevance":0.5,"resolutions":{"analytics":1}},"content":{"relevance":0.5,"resolutions":{"100":1}}}')
    })
  })
  describe('fromJSON', () => {
    test('should create an instance of ScoredPreferences from base64 encoded JSON data', () => {
      // Sample JSON data representing preferences
      const input = {
        cost: {
          relevance: 0.4,
          resolutions: {
            5: 1,
            2: 0.7
          }
        },
        consent: {
          relevance: 0.3,
          resolutions: {
            analytics: 0.5,
            marketing: 0.5
          }
        },
        content: {
          relevance: 0.3,
          resolutions: {
            100: 1,
            70: 0.8
          }
        }
      }
      // Call the fromJSON method to create an instance from JSON data
      const preferences = ScoredPreferences.fromJSON(
        JSON.parse(JSON.stringify(input))
      )

      // Verify that the instance is created with the correct properties
      expect(preferences).toEqual(input)
    })

    test('should create an instance of ScoredPreferences from base64 encoded JSON data', () => {
      // Sample JSON data representing preferences
      const input = {
        cost: {
          relevance: 0.4,
          resolutions: {
            5: 1,
            2: 0.7
          }
        },
        consent: {
          relevance: 0.3,
          resolutions: {
            analytics: 0.5,
            marketing: 0.5
          }
        },
        content: {
          relevance: 0.3,
          resolutions: {
            100: 1,
            70: 0.8
          }
        }
      }
      // Call the fromJSON method to create an instance from JSON data
      const preferences = ScoredPreferences.fromJSON(
        JSON.parse(JSON.stringify(input))
      )

      // Verify that the instance is created with the correct properties
      expect(preferences).toEqual(input)
    })
    test('should throw Error for invalid issue', () => {
      // Sample JSON data representing preferences
      const input = {
        invalidIssue: {
          relevance: 0.4,
          resolutions: {
            5: 1,
            2: 0.7
          }

        }
      }

      expect(() => {
        ScoredPreferences.fromJSON(JSON.parse(JSON.stringify(input)))
      }).toThrow(Error)
    })

    test('should throw Error for invalid issue', () => {
      // Sample JSON data representing preferences
      const input = {

      }

      expect(() => {
        ScoredPreferences.fromJSON(btoa(JSON.stringify(input)))
      }).toThrow(Error('Unknown issue \'0\'.'))
    })

    test('Accepts preferences with only consent and content', () => {
      // Sample JSON data representing preferences
      const input = {
        consent: {
          relevance: 0.7,
          resolutions: {
            analytics: 0.5,
            marketing: 0.5
          }
        },
        content: {
          relevance: 0.3,
          resolutions: {
            100: 1,
            70: 0.8
          }
        }
      }

      // Call the fromJSON method to create an instance from JSON data
      const preferences = ScoredPreferences.fromJSON(
        JSON.parse(JSON.stringify(input))
      )

      // Verify that the instance is created with the correct properties
      expect(preferences).toEqual({
        cost: new Issue(),
        consent: {
          relevance: 0.7,
          resolutions: {
            analytics: 0.5,
            marketing: 0.5
          }
        },
        content: {
          relevance: 0.3,
          resolutions: {
            100: 1,
            70: 0.8
          }
        }
      })
    })

    test('throws if sum of relevances != 1', () => {
      const input = {
        consent: {
          relevance: 1,
          resolutions: {
            analytics: 0.5,
            marketing: 0.5
          }
        },
        content: {
          relevance: 1,
          resolutions: {
            100: 1,
            70: 0.8
          }
        }
      }

      expect(() => {
        ScoredPreferences.fromJSON(JSON.parse(JSON.stringify(input)))
      }).toThrow(Error('Sum of relevances must be 1'))

      // Invalid JSON data
      /* const invalidJsonData = 'invalid JSON';

             // Call the fromJSON method with invalid JSON data
             const createInstance = () => ScoredConsentPreferences.fromJSON(invalidJsonData);

             // Verify that it throws an error
             expect(createInstance).toThrowError(SyntaxError); */
    })
  })

  describe('fromData', () => {
    test('should create an instance of ScoredPreferences from plain obj', () => {
      const data = {
        cost: {
          relevance: 0.2,
          resolutions: { 0: 1 }
        },
        consent: {
          relevance: 0.5,
          resolutions: {
            analytics: 1
          }
        },
        content: {
          relevance: 0.3,
          resolutions: {
            100: 1
          }
        }
      }

      const actual = ScoredPreferences.fromData(data)

      expect(actual).toEqual(
        new ScoredPreferences()
          .setConsent(new Issue().setRelevance(0.5).setResolutions({ analytics: 1 }))
          .setCost(new Issue().setRelevance(0.2).setResolutions({ 0: 1 }))
          .setContent(new Issue().setRelevance(0.3).setResolutions({ 100: 1 }))
      )
    })
    test('if any is null set it to null', () => {
      const data = {}

      const actual = ScoredPreferences.fromData(data)

      expect(actual).toEqual(
        new ScoredPreferences()
          .setConsent(null)
          .setCost(null)
          .setContent(null)
      )
    })
  })
})
