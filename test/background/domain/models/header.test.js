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
    describe('fromString', () => {
        test('should create the instance from header string', () => {
            const input = "status=exchange preferences=eyJjb3N0Ijp7IjUwIjoxMCwiODAiOjIwLCIxMDAiOjMwfSwiY29uc2VudCI6eyJyZWplY3RBbGwiOjQwLCJhY2NlcHRBbGwiOjUsImFuYWx5dGljcyI6MTAsIm1hcmtldGluZyI6MTAsInBlcnNvbmFsaXplZENvbnRlbnQiOjEwLCJwZXJzb25hbGl6ZWRBZHMiOjEwLCJleHRlcm5hbENvbnRlbnQiOjEwLCJpZGVudGlmaWNhdGlvbiI6NX0sImNvbnRlbnQiOnsiMi45OSI6MjAsIjUuNDkiOjEwLCI3LjE5Ijo1fX0= cost=2 consent=rejectAll acceptAll analytics marketing personalizedContent personalizedAds externalContent identification content=90"
            const actual = Header.fromString(input)

            expect(actual).toEqual(
                new Header(
                    'exchange',
                    new ScoredPreferences(
                        { '50': 10, '80': 20, '100': 30 },
                        {
                            rejectAll: 40,
                            acceptAll: 5,
                            analytics: 10,
                            marketing: 10,
                            personalizedContent: 10,
                            personalizedAds: 10,
                            externalContent: 10,
                            identification: 5
                        },
                        { '2.99': 20, '5.49': 10, '7.19': 5 }
                    ),
                    new Consent(true, true, true, true, true, true, true, true),
                    '2', '90'))
        });

        test('IF only status provided, THEN create header with status only', () => {
            const input = "status=exchange"
            const actual = Header.fromString(input)

            expect(actual).toEqual(new Header('exchange', null, null, null, null))
        });

        test('IF only status & preferences provided, THEN create header with status & preferences only', () => {
            const input = "status=exchange preferences=eyJjb3N0Ijp7IjUwIjoxMCwiODAiOjIwLCIxMDAiOjMwfSwiY29uc2VudCI6eyJyZWplY3RBbGwiOjQwLCJhY2NlcHRBbGwiOjUsImFuYWx5dGljcyI6MTAsIm1hcmtldGluZyI6MTAsInBlcnNvbmFsaXplZENvbnRlbnQiOjEwLCJwZXJzb25hbGl6ZWRBZHMiOjEwLCJleHRlcm5hbENvbnRlbnQiOjEwLCJpZGVudGlmaWNhdGlvbiI6NX0sImNvbnRlbnQiOnsiMi45OSI6MjAsIjUuNDkiOjEwLCI3LjE5Ijo1fX0="
            const actual = Header.fromString(input)

            expect(actual).toEqual(
                new Header(
                    'exchange',
                    new ScoredPreferences(
                        { '50': 10, '80': 20, '100': 30 },
                        {
                            rejectAll: 40,
                            acceptAll: 5,
                            analytics: 10,
                            marketing: 10,
                            personalizedContent: 10,
                            personalizedAds: 10,
                            externalContent: 10,
                            identification: 5
                        },
                        { '2.99': 20, '5.49': 10, '7.19': 5 }
                    ),
                    null, null, null))
        });

        test('IF only status & consent provided, THEN create header with status & consent only', () => {
            const input = "status=exchange consent=marketing personalizedContent"
            const actual = Header.fromString(input)

            expect(actual).toEqual(
                new Header(
                    'exchange',
                    null, new Consent(false, false, false, true, true, false, false, false),
                    null, null))
        });

        test('IF only status & content provided, THEN create header with status & content only', () => {
            const input = "status=exchange content=90"
            const actual = Header.fromString(input)

            expect(actual).toEqual(
                new Header(
                    'exchange',
                    null, null,
                    null, '90'))
        });

        test('IF only status & cost provided, THEN create header with status & cost only', () => {
            const input = "status=exchange cost=2"
            const actual = Header.fromString(input)

            expect(actual).toEqual(
                new Header(
                    'exchange',
                    null, null,
                    '2', null))
        });

        test('IF only status & consent & content provided, THEN create header with status & consent & content only', () => {
            const input = "status=exchange consent=marketing personalizedContent content=90"
            const actual = Header.fromString(input)

            expect(actual).toEqual(
                new Header(
                    'exchange',
                    null, new Consent(false, false, false, true, true, false, false, false),
                    null, '90'))
        });
    });
});