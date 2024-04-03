/* eslint-disable no-undef */
import ScoredPreferences from '../../../../../src/background/domain/models/scored_preferences/scored_preferences.js'

describe('ScoredPreferences', () => {
  describe('toBase64EncodedString', () => {
    test('should deserialize 2C preferences an instance to a base64 encoded JSON', () => {
      const scoredPreferences = new ScoredPreferences()

      scoredPreferences.consent = { relevance: 0.5, resolutions: { analytics: 1 } }
      scoredPreferences.content = { relevance: 0.5, resolutions: { 100: 1 } }

      const actual = scoredPreferences.toBase64EncodedJSON()

      expect(atob(actual)).toBe('{"cost":{},"consent":{"relevance":0.5,"resolutions":{"analytics":1}},"content":{"relevance":0.5,"resolutions":{"100":1}}}')
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
      const preferences = ScoredPreferences.fromBase64EncodedJSON(btoa(JSON.stringify(input)))

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
      const preferences = ScoredPreferences.fromBase64EncodedJSON(
        btoa(JSON.stringify(input))
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
        ScoredPreferences.fromBase64EncodedJSON(btoa(JSON.stringify(input)))
      }).toThrow(Error)
    })

    test('should throw Error for invalid issue', () => {
      // Sample JSON data representing preferences
      const input = {

      }

      expect(() => {
        ScoredPreferences.fromBase64EncodedJSON(btoa(JSON.stringify(input)))
      }).toThrow(Error)
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
      const preferences = ScoredPreferences.fromBase64EncodedJSON(
        btoa(JSON.stringify(input))
      )

      // Verify that the instance is created with the correct properties
      expect(preferences).toEqual({
        cost: {},
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

    test('should throw an error for invalid JSON data', () => {
      // Invalid JSON data
      /* const invalidJsonData = 'invalid JSON';

             // Call the fromJSON method with invalid JSON data
             const createInstance = () => ScoredConsentPreferences.fromJSON(invalidJsonData);

             // Verify that it throws an error
             expect(createInstance).toThrowError(SyntaxError); */
    })
  })
})
