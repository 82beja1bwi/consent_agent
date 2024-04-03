/* eslint-disable no-undef */
import Consent from '../../../../src/background/domain/models/consent.js'

describe('Header', () => {
  describe('toString', () => {
    test('should convert the instance to the String header in space separation', () => {
      const instance = new Consent(true, true, true, true, true, true)

      expect(instance.toString()).toBe('analytics marketing personalizedContent personalizedAds externalContent identification')
    })
  })

  describe('fromString', () => {
    test('should create an instance from a given string', () => {
      const input = 'rejectAll acceptAll analytics marketing personalizedContent personalizedAds externalContent identification'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(new Consent(true, true, true, true, true, true, true, true))
    })

    test('IF only analytics in string, THEN only analytics is true', () => {
      const input = 'analytics'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(new Consent(true, false, false, false, false, false))
    })

    test('IF only marketing in string, THEN only marketing is true', () => {
      const input = 'marketing'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(new Consent(false, true, false, false, false, false))
    })

    test('IF only personalizedContent in string, THEN only personalizedContent is true', () => {
      const input = 'personalizedContent'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(new Consent(false, false, true, false, false, false))
    })

    test('IF only personalizedAds in string, THEN only personalizedAds is true', () => {
      const input = 'personalizedAds'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(new Consent(false, false, false, true, false, false))
    })

    test('IF only externalContent in string, THEN only externalContent is true', () => {
      const input = 'externalContent'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(new Consent(false, false, false, false, true, false))
    })

    test('IF only identification in string, THEN only identification is true', () => {
      const input = 'identification'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(new Consent(false, false, false, false, false, true))
    })
  })
})
