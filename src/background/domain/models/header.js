import ScoredPreferences from "./scored_preferences/scored_preferences.js";
import Consent from "./consent.js"

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
    fromString(header) {

    }


}