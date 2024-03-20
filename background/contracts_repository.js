import './models/contract.js';

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

export {getContract, setContract}