//import Consent from './models/consent';

class Consent {
    constructor(analytics, marketing, personalizedContent, personalizedAds, externalContent, identification) {
        this.analytics = analytics;
        this.marketing = marketing;
        this.personalizedContent = personalizedContent;
        this.personalizedAds = personalizedAds;
        this.externalContent = externalContent;
        this.identification = identification;
    }
}

class Contract {
    constructor(baseURL, consent, cost, content) {
        this.baseURL = baseURL; //domain of website
        this.consent = consent; //of class Consent
        this.cost = cost; //
        this.content = content;
    }
}

//CONTRACT REPOSITORY
const contracts = {};

function getContract(baseURL) {
    return contracts[baseURL] || null;
}

function setContract(baseURL, contract) {
    if (contract instanceof Contract) {
        contracts[baseURL] = contract;
        console.log("Contract stored for ", contract.baseURL)
    }

}

//INTERCEPTOR
async function getBaseURL() {
    try {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        const currentTab = tabs[0];
        const currentUrl = new URL(currentTab.url);
        const baseURL = currentUrl.origin;
        return baseURL;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}


// Event listener for intercepting HTTP requests
browser.webRequest.onBeforeSendHeaders.addListener(
    async function (details) {
        try {
            //IF no agreement exists, THEN should start negotiation 
            //consequence: user clicks around in domain and negotiation will only be started once
            const baseURL = await getBaseURL();
            console.log("Base URL:", baseURL);
            const contract = getContract(baseURL);
            const contractExists = (contract == null) ? false : true
            if (!contractExists) {
                console.log("No contract found for base URL:", baseURL);
                //TODO: Praeferenzen laden
                //
                //Contract is initiated
                setContract(baseURL, new Contract(baseURL, new Consent(false, false, false, false, false, false), 0, 100))
                console.log("Initiated contract")
                //TODO: construct initial header
                details.requestHeaders.push({
                    name: "X-Custom-Header",
                    value: "HelloImTheClientsAgent"
                });
                console.log("header interecepted and modified")

            } else {
                console.log("Contract found:", contract);
            }
            
            return { requestHeaders: details.requestHeaders };

        } catch (error) {
            console.error("An error occurred:", error);
            console.error("Stack trace:", error.stack);
            throw error; // Re-throw the error to propagate it further
        }
    },
    { urls: ["<all_urls>"] }, // Intercept all URLs
    ["blocking", "requestHeaders"]
);

// Event listener for intercepting HTTP responses
browser.webRequest.onCompleted.addListener(
    function(details) {
        // Check if the request was successful
        if (details.statusCode === 200) {
            // Access the response headers
            var responseHeaders = details.responseHeaders;
            // Process the response headers as needed
            console.log("Response headers:", responseHeaders);
        }
    },
    { urls: ["<all_urls>"] }, // Intercept all URLs
    []
);
