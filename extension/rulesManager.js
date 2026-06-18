// rulesManager.js

export function getRules(callback) {

    chrome.storage.local.get(["rules"], (result) => {

        callback(result.rules || {});

    });

}

export function saveRule(domain, score) {

    chrome.storage.local.get(["rules"], (result) => {

        let rules = result.rules || {};

        rules[domain] = Number(score);

        chrome.storage.local.set({
            rules: rules
        });

    });

}

export function deleteRule(domain) {

    chrome.storage.local.get(["rules"], (result) => {

        let rules = result.rules || {};

        delete rules[domain];

        chrome.storage.local.set({
            rules: rules
        });

    });

}