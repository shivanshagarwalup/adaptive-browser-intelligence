console.log("FocusLens service worker started");

// Current tracking state
let previousDomain = null;
let startTime = null;

// Extract domain from URL
function extractDomain(url) {
    try {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname;
    } catch (error) {
        console.error("Invalid URL:", url);
        return null;
    }
}

// Ignore internal browser pages
function isTrackable(url) {
    if (!url) return false;

    return !(
        url.startsWith("chrome://") ||
        url.startsWith("edge://") ||
        url.startsWith("about:") ||
        url.startsWith("chrome-extension://")
    );
}

// Save activity in local storage
function saveActivity(activity) {
    chrome.storage.local.get(["activity_log"], (result) => {

        let activityLog = result.activity_log || [];

        activityLog.push(activity);

        chrome.storage.local.set({
            activity_log: activityLog
        }, () => {
            console.log("Saved activity:", activity);
        });
    });
}

// Main tracking logic
function handleTabSwitch(tab) {

    if (!tab || !tab.url) return;

    if (!isTrackable(tab.url)) return;

    const currentDomain = extractDomain(tab.url);
    const currentTime = Date.now();

    console.log("Switched to:", currentDomain);

    // If previous site exists → calculate duration
    if (previousDomain !== null && startTime !== null) {

        const durationSeconds =
            Math.floor((currentTime - startTime) / 1000);

        // Ignore accidental short visits
        if (durationSeconds >= 5) {

            const activityEvent = {
                domain: previousDomain,
                start_time: startTime,
                end_time: currentTime,
                duration_seconds: durationSeconds
            };

            saveActivity(activityEvent);

            console.log(
                `Tracked: ${previousDomain} for ${durationSeconds} sec`
            );
        }
    }

    // Start tracking new site
    previousDomain = currentDomain;
    startTime = currentTime;
}

// Listen ONLY when active tab changes
chrome.tabs.onActivated.addListener((activeInfo) => {

    chrome.tabs.get(activeInfo.tabId, (tab) => {

        console.log("Tab switched");

        handleTabSwitch(tab);

    });

});