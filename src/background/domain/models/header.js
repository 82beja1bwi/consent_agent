import ScoredPreferences from "./scored_preferences/scored_preferences.js";
import Consent from "./consent.js"
import ScoredConsentPreferences from "./scored_preferences/scored_consent_preferences.js";

export const NegotiationStatus = {
    EXCHANGE: 'exchange',
    NEGOTIATION: 'negotiation',
    ACCEPTED: 'accepted'
};

export default class Header {
    constructor(status, preferences, consent, cost, content) {
        this.status = status; //domain of website
        this.preferences = preferences
        this.consent = consent; //[analytics, marketing...] a list!
        this.cost = cost;
        this.content = content;
    }
    //Deserialization
    toString() {
        let header = "status=" + this.status.toString() + " "

        if (this.preferences && this.preferences instanceof ScoredPreferences) {
            //TODO: toBase64EncodedJSON for preferences
            header += "preferences=" + this.preferences.toBase64EncodedJSON() + " "
        }

        if (this.cost) {
            header += "cost=" + this.cost + " "
        }

        if (this.consent && this.consent instanceof Consent) {
            //TODO: toString for consent
            let concat = this.consent.toString()
            if (concat.length > 0)
                header += "consent=" + concat + " "
        }

        if (this.content) {
            header += "content=" + this.content
        }

        return header.trimEnd()
    }

    //Serialization
    //status=... (optional) preferences=base64encondedString (optional) consent=analytics marketing ... 
    //       (optional) cost=2 (optional) content=50
    static fromString(header) {
        const patterns = [/status=[^ ]+/, /preferences=[^ ]+/, /consent=.*?(?= content=|$)/, /cost=[^ ]+/, /content=[^ ]+/]
        const matches = patterns.map(p => {
            const match = p.exec(header)
            return match ? match[0].split('=')[1] : null
        })

        if (matches[1])
            matches[1] = ScoredPreferences.fromBase64EncodedJSON(matches[1])

        if(matches[2])
            matches[2] = Consent.fromString(matches[2])
        

        return new Header(matches[0], matches[1], matches[2], matches[3], matches[4])
    }


}