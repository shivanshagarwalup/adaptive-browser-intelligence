import { getRules, saveRule } from "./rulesManager.js";

const domainInput =
document.getElementById("domainInput");

const scoreInput =
document.getElementById("scoreInput");

const addRuleBtn =
document.getElementById("addRuleBtn");

const rulesList =
document.getElementById("rulesList");


function renderRules() {

    getRules((rules) => {

        rulesList.innerHTML = "";

        for (let domain in rules) {

            let p = document.createElement("p");

            p.textContent =
            `${domain} : ${rules[domain]}`;

            rulesList.appendChild(p);

        }

    });

}


addRuleBtn.addEventListener("click", () => {

    let domain = domainInput.value.trim();

    let score = scoreInput.value.trim();

    if (!domain || !score) return;

    saveRule(domain, score);

    domainInput.value = "";
    scoreInput.value = "";

    renderRules();

});

renderRules();