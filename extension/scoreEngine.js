// scoreEngine.js

export function calculateScore(domain, callback) {

    chrome.storage.local.get(["rules"], (result) => {

        let rules = result.rules || {};

        if (domain in rules) {
            callback(rules[domain]);
        }
        else {
            callback(0);
        }

    });

}