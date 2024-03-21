export default class ScoredPreferences {
    constructor(cost, consent, content) {
        this.cost = cost; //Map<int,int>
        this.consent = consent; //ScoredConsentPreferences
        this.content = content; //Map<int,int> 
    }

    toBase64EncodedJSON(){
        return btoa(JSON.stringify(this));
    }

    static fromJSON(json) {
        const data = JSON.parse(json)
        return new ScoredPreferences(
            data.cost,
            data.consent,
            data.content,
        );
    }
}