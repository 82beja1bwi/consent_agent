import ScoredConsentPreferences from '../../../../../src/background/domain/models/scored_preferences/scored_consent_preferences.js';

describe('ScoredConsentPreferences', () => {
    describe('fromJSON', () => {
        it('should create an instance of ScoredConsentPreferences from base64 encoded JSON data', () => {
            // Sample JSON data representing preferences
            var jsonData = '{"rejectAll":false,"acceptAll":true,"analytics":true,"marketing":false,"personalizedContent":true,"personalizedAds":false,"externalContent":true,"identification":true}';
            jsonData = btoa(jsonData)
            // Call the fromJSON method to create an instance from JSON data
            const preferences = ScoredConsentPreferences.fromBase64EncodedJSON(jsonData);

            // Verify that the instance is created with the correct properties
            expect(preferences.rejectAll).toBe(false);
            expect(preferences.acceptAll).toBe(true);
            expect(preferences.analytics).toBe(true);
            expect(preferences.marketing).toBe(false);
            expect(preferences.personalizedContent).toBe(true);
            expect(preferences.personalizedAds).toBe(false);
            expect(preferences.externalContent).toBe(true);
            expect(preferences.identification).toBe(true);
        });

        test('should throw an error for invalid JSON data', () => {
            // Invalid JSON data
            const invalidJsonData = 'invalid JSON';

            // Call the fromJSON method with invalid JSON data
            const createInstance = () => ScoredConsentPreferences.fromBase64EncodedJSON(invalidJsonData);

            // Verify that it throws an error
            expect(createInstance).toThrowError(SyntaxError);
        });
    });
});
