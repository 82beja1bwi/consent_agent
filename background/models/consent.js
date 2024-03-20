export default class Consent {
    constructor(analytics, marketing, personalizedContent, personalizedAds, externalContent, identification) {
        this.analytics = analytics;
        this.marketing = marketing;
        this.personalizedContent = personalizedContent;
        this.personalizedAds = personalizedAds;
        this.externalContent = externalContent;
        this.identification = identification;
    }
}