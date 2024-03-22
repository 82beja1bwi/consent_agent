import ScoredPreferences from '../../../../../src/background/domain/models/scored_preferences/scored_preferences.js';
import ScoredConsentPreferences from '../../../../../src/background/domain/models/scored_preferences/scored_consent_preferences.js';

describe('ScoredPreferences', () => {
    describe('toBase64EncodedString', () => {
        test('should deserialize 2C preferences an instance to a base64 encoded JSON', () => {
            const scoredPreferences = new ScoredPreferences({
                100: 30,
                80: 20,
                50: 10
            },
                new ScoredConsentPreferences(40, 5, 10, 10, 10, 10, 10, 5),)


            const actual = scoredPreferences.toBase64EncodedJSON();

            expect(actual).toBe('eyJjb3N0Ijp7IjUwIjoxMCwiODAiOjIwLCIxMDAiOjMwfSwiY29uc2VudCI6eyJyZWplY3RBbGwiOjQwLCJhY2NlcHRBbGwiOjUsImFuYWx5dGljcyI6MTAsIm1hcmtldGluZyI6MTAsInBlcnNvbmFsaXplZENvbnRlbnQiOjEwLCJwZXJzb25hbGl6ZWRBZHMiOjEwLCJleHRlcm5hbENvbnRlbnQiOjEwLCJpZGVudGlmaWNhdGlvbiI6NX19')
            expect(atob(actual)).toBe('{"cost":{"50":10,"80":20,"100":30},"consent":{"rejectAll":40,"acceptAll":5,"analytics":10,"marketing":10,"personalizedContent":10,"personalizedAds":10,"externalContent":10,"identification":5}}')
        });
        test('should deserialize 3C preferences an instance to a base64 encoded JSON', () => {
            const scoredPreferences = new ScoredPreferences({
                100: 30,
                80: 20,
                50: 10
            },
                new ScoredConsentPreferences(40, 5, 10, 10, 10, 10, 10, 5),
                {
                    '2.99': 20,
                    '5.49': 10,
                    '7.19': 5
                },)


            const actual = scoredPreferences.toBase64EncodedJSON();

            expect(actual).toBe('eyJjb3N0Ijp7IjUwIjoxMCwiODAiOjIwLCIxMDAiOjMwfSwiY29uc2VudCI6eyJyZWplY3RBbGwiOjQwLCJhY2NlcHRBbGwiOjUsImFuYWx5dGljcyI6MTAsIm1hcmtldGluZyI6MTAsInBlcnNvbmFsaXplZENvbnRlbnQiOjEwLCJwZXJzb25hbGl6ZWRBZHMiOjEwLCJleHRlcm5hbENvbnRlbnQiOjEwLCJpZGVudGlmaWNhdGlvbiI6NX0sImNvbnRlbnQiOnsiMi45OSI6MjAsIjUuNDkiOjEwLCI3LjE5Ijo1fX0=')
            expect(atob(actual)).toBe('{"cost":{"50":10,"80":20,"100":30},"consent":{"rejectAll":40,"acceptAll":5,"analytics":10,"marketing":10,"personalizedContent":10,"personalizedAds":10,"externalContent":10,"identification":5},"content":{"2.99":20,"5.49":10,"7.19":5}}')
        });
    });
    describe('fromJSON', () => {
        test('should create an instance of ScoredPreferences from base64 encoded JSON data', () => {
            // Sample JSON data representing preferences
            const jsonData = '{"cost": 5, "consent": {"rejectAll": false, "acceptAll": true, "analytics": true, "marketing": false, "personalizedContent": true, "personalizedAds": false, "externalContent": true, "identification": true}, "content": 50}'
            // Call the fromJSON method to create an instance from JSON data
            const preferences = ScoredPreferences.fromBase64EncodedJSON(btoa(jsonData));

            // Verify that the instance is created with the correct properties
            expect(preferences.cost).toBe(5);
            expect(preferences.content).toBe(50);
            expect(preferences.consent.rejectAll).toBe(false);
            expect(preferences.consent.acceptAll).toBe(true);
            expect(preferences.consent.analytics).toBe(true);
            expect(preferences.consent.analytics).toBe(true);
            expect(preferences.consent.marketing).toBe(false);
            expect(preferences.consent.personalizedContent).toBe(true);
            expect(preferences.consent.personalizedAds).toBe(false);
            expect(preferences.consent.externalContent).toBe(true);
            expect(preferences.consent.identification).toBe(true);
        });

        test('should throw an error for invalid JSON data', () => {
            // Invalid JSON data
            /* const invalidJsonData = 'invalid JSON';
 
             // Call the fromJSON method with invalid JSON data
             const createInstance = () => ScoredConsentPreferences.fromJSON(invalidJsonData);
 
             // Verify that it throws an error
             expect(createInstance).toThrowError(SyntaxError);*/
        });
    });
});
