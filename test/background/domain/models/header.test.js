import Consent from '../../../../src/background/domain/models/consent.js';
import Header from '../../../../src/background/domain/models/header.js'
import ScoredConsentPreferences from '../../../../src/background/domain/models/scored_preferences/scored_consent_preferences.js';
import ScoredPreferences from '../../../../src/background/domain/models/scored_preferences/scored_preferences.js';

describe('Header', () => {
    describe('toString', () => {
        test('should convert the instance to the String header value', () => {
            const instance = new Header('exchange',
                new ScoredPreferences({
                    100: 30,
                    80: 20,
                    50: 10
                },
                    new ScoredConsentPreferences(40, 5, 10, 10, 10, 10, 10, 5),
                    {
                        '2.99': 20,
                        '5.49': 10,
                        '7.19': 5
                    },),
                new Consent(true, true, true, true, true, true, true, true),
                2,
                90
            )

            expect(instance.toString()).toBe('status=exchange preferences=eyJjb3N0Ijp7IjUwIjoxMCwiODAiOjIwLCIxMDAiOjMwfSwiY29uc2VudCI6eyJyZWplY3RBbGwiOjQwLCJhY2NlcHRBbGwiOjUsImFuYWx5dGljcyI6MTAsIm1hcmtldGluZyI6MTAsInBlcnNvbmFsaXplZENvbnRlbnQiOjEwLCJwZXJzb25hbGl6ZWRBZHMiOjEwLCJleHRlcm5hbENvbnRlbnQiOjEwLCJpZGVudGlmaWNhdGlvbiI6NX0sImNvbnRlbnQiOnsiMi45OSI6MjAsIjUuNDkiOjEwLCI3LjE5Ijo1fX0= cost=2 consent=rejectAll acceptAll analytics marketing personalizedContent personalizedAds externalContent identification content=90')

        });

        test('empty fields are not included in String header value', () => {
            const instance = new Header('exchange',
                null,
                new Consent(false, false, false, false, false, false, false, false),
                null,
                null
            )

            expect(instance.toString()).toBe('status=exchange')
        });


        
    });
});