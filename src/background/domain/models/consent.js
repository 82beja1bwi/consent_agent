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
}