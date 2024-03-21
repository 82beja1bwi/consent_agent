///Contains preferences in int for each option
export default class ScoredConsentPreferences {
    constructor(rejectAll, acceptAll, analytics, marketing, personalizedContent, personalizedAds, externalContent, identification) {
        this.rejectAll = rejectAll;
        this.acceptAll = acceptAll;
        this.analytics = analytics;
        this.marketing = marketing;
        this.personalizedContent = personalizedContent;
        this.personalizedAds = personalizedAds;
        this.externalContent = externalContent;
        this.identification = identification;
    }

    /*    
    toJSON(){
        return JSON.stringify(this)
    }
    */

    static fromJSON(json) {
        const data = JSON.parse(json);
        return new ScoredConsentPreferences(
            data.rejectAll,
            data.acceptAll,
            data.analytics,
            data.marketing,
            data.personalizedContent,
            data.personalizedAds,
            data.externalContent,
            data.identification
        );
    }

}