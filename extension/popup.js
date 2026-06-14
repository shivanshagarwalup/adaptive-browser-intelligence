chrome.storage.local.get(["activity_log"], (result) => {

    let activity = result.activity_log || [];

    document.getElementById("sessionCount").innerText =
        "Sessions: " + activity.length;

    if (activity.length > 0) {

        let last = activity[activity.length - 1];

        document.getElementById("lastSite").innerText =
            "Last Site: " + last.domain;
    }
});