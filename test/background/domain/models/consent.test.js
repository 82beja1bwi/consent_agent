/* eslint-disable no-undef */
import Consent from '../../../../src/background/domain/models/consent.js'

describe('Consent', () => {
  describe('isRejectAll', () => {
    test('if at least 1 is true then rejectedAll is false', () => {
      const instance = new Consent().setAnalytics(true)
      const result = instance.isRejectAll()
      expect(result).toBe(false)
    })
    test('if none is true then rejectedAll is true', () => {
      const instance = new Consent()
      const result = instance.isRejectAll()
      expect(result).toBe(true)
    })
    test('if all are true then rejectedAll is false', () => {
      const instance = new Consent()
        .setAnalytics(true)
        .setExternalContent(true)
        .setIdentification(true)
        .setMarketing(true)
        .setPersonalizedAds(true)
        .setPersonalizedContent(true)
      const result = instance.isRejectAll()
      expect(result).toBe(false)
    })
  })
  describe('toString', () => {
    test('should convert the instance to the String header in space separation', () => {
      const instance = new Consent()
        .setAnalytics(true)
        .setExternalContent(true)
        .setIdentification(true)
        .setMarketing(true)
        .setPersonalizedAds(true)
        .setPersonalizedContent(true)

      expect(instance.toString()).toBe(
        'analytics marketing personalizedContent personalizedAds externalContent identification'
      )
    })

    test('only true consent options are included in string', () => {
      const instance = new Consent().setAnalytics(true)

      expect(instance.toString()).toBe('analytics')
    })

    test('no consent returns empty string', () => {
      const instance = new Consent()

      expect(instance.toString()).toBe('')
    })
  })

  describe('fromString', () => {
    test('should create an instance from a given string', () => {
      const input =
        'rejectAll acceptAll analytics marketing personalizedContent personalizedAds externalContent identification'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(
        new Consent()
          .setAnalytics(true)
          .setExternalContent(true)
          .setIdentification(true)
          .setMarketing(true)
          .setPersonalizedAds(true)
          .setPersonalizedContent(true)
      )
    })

    test('IF only analytics in string, THEN only analytics is true', () => {
      const input = 'analytics'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(new Consent().setAnalytics(true))
    })

    test('IF only marketing in string, THEN only marketing is true', () => {
      const input = 'marketing'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(new Consent().setMarketing(true))
    })

    test('IF only personalizedContent in string, THEN only personalizedContent is true', () => {
      const input = 'personalizedContent'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(new Consent().setPersonalizedContent(true))
    })

    test('IF only personalizedAds in string, THEN only personalizedAds is true', () => {
      const input = 'personalizedAds'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(new Consent().setPersonalizedAds(true))
    })

    test('IF only externalContent in string, THEN only externalContent is true', () => {
      const input = 'externalContent'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(new Consent().setExternalContent(true))
    })

    test('IF only identification in string, THEN only identification is true', () => {
      const input = 'identification'
      const actual = Consent.fromString(input)

      expect(actual).toEqual(new Consent().setIdentification(true))
    })
  })

  describe('fromObject', () => {
    test('should create an instance from a given object', () => {
      const object = {
        analytics: true,
        marketing: false,
        personalizedContent: true,
        personalizedAds: false,
        externalContent: true,
        identification: false
      }

      // Expected Consent instance
      const expectedConsent = new Consent()
        .setAnalytics(true)
        .setMarketing(false)
        .setPersonalizedContent(true)
        .setPersonalizedAds(false)
        .setExternalContent(true)
        .setIdentification(false)

      // Call the fromObject method
      const result = Consent.fromObject(object)

      // Assertions
      expect(result).toEqual(expectedConsent)
    })
    test('returns a Consent instance with all properties set to false when input object is null', () => {
      // Call the fromObject method with null input
      const result = Consent.fromObject({})

      // Expected Consent instance with all properties set to false
      const expectedConsent = new Consent()
        .setAnalytics(false)
        .setMarketing(false)
        .setPersonalizedContent(false)
        .setPersonalizedAds(false)
        .setExternalContent(false)
        .setIdentification(false)

      // Assertions
      expect(result).toEqual(expectedConsent)
    })
  })
})
