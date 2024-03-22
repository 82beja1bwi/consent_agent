///Consent in bool
///Current state is bool = true
export default class Consent {
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

    toString(){
        let string = ""

        if(this.rejectAll){
            string+="rejectAll "
        }
        if(this.acceptAll){
            string+="acceptAll "
        }
        if(this.analytics){
            string+="analytics "
        }
        if(this.marketing){
            string+="marketing "
        }
        if(this.personalizedContent){
            string+="personalizedContent "
        }
        if(this.personalizedAds){
            string+="personalizedAds "
        }
        if(this.externalContent){
            string+="externalContent "
        }
        if(this.identification){
            string+="identification "
        }

        return string.trimEnd()
    }

    //create instance from consent string (s. header)
    //example string: 'rejectAll acceptAll analytics marketing personalizedContent personalizedAds externalContent identification'
    static fromString(string){
        // Split the string into individual words
        const options = string.split(' ');

        // Map each word to its corresponding boolean value
        const consent = {
            'rejectAll': false,
            'acceptAll': false,
            'analytics': false,
            'marketing': false,
            'personalizedContent': false,
            'personalizedAds': false,
            'externalContent': false,
            'identification': false
        };

        // Set the boolean values based on the words in the string
        options.forEach(word => {
            if (consent.hasOwnProperty(word)) {
                consent[word] = true;
            }
        });

        // Return a new instance of Consent with the boolean values
        return new Consent(
            consent.rejectAll,
            consent.acceptAll,
            consent.analytics,
            consent.marketing,
            consent.personalizedContent,
            consent.personalizedAds,
            consent.externalContent,
            consent.identification
        );
    }
}