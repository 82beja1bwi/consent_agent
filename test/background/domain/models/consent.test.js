import Consent from '../../../../src/background/domain/models/consent.js';

describe('Header', () => {
    describe('toString', () => {
        it('should convert the instance to the String header in space separation', () => {
            const instance = new Consent(true, true, true, true, true, true, true, true)

            expect(instance.toString()).toBe('rejectAll acceptAll analytics marketing personalizedContent personalizedAds externalContent identification')
        });
    });
});