import Contract from './domain/models/contract.js';
import Consent from './domain/models/contract.js';
import {getContract, setContract} from './storage/contracts_repository.js'


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
                console.log("header intercepted and modified")

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

// Event listener for ADPC Header in responses
browser.webRequest.onHeadersReceived.addListener(
    function(details) {
        // Check if the request was successful
        if (details.statusCode === 200) {
            // Access the response headers
            var responseHeaders = details.responseHeaders;
            const header = responseHeaders.find(header => header.name.toLowerCase() === 'x-custom');
            if(header){
                //Now this agent has to prepare a response
                const value = header.value;
                console.log("received custom header: ", value)
                //TODO: calculate response
                //TODO: send response                
                const headers = {
                    'X-New-Header': 'Your-Value'
                };
                const url = new URL(details.url, details.originUrl);
                console.log("Request URL:", url.href);
                
                // Send the new HTTP request
                fetch(url, { headers });
            }
            
        }
    },
    { urls: ["<all_urls>"] }, // Intercept all URLs
    ["responseHeaders"] 
);
