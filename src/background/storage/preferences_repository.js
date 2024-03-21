import Contract from '../models/contract.js';

let preferences;


export function getPreferences() {
    return preferences || null;
}

export function setPreferences(preferences) {
    if (preferences instanceof Contract) {
        contracts[baseURL] = contract;
        console.log("Contract stored for ", contract.baseURL)
    }
}