

console.log("FocusLens tracker started");

// Current tracking session
let currentDomain = null;
let sessionStart = null;
let isTracking = false;


/* Extract domain from URL */
function extractDomain(url) {
    try {
        return new URL(url).hostname;
    } catch {
        return null;
    }
}


/* Ignore internal browser pages */
function isTrackable(url) {
    if (!url) return false;

    return !(
        url.startsWith("chrome://") ||
        url.startsWith("edge://") ||
        url.startsWith("about:") ||
        url.startsWith("chrome-extension://")
    );
}


/* Start tracking */
function startTracking(domain) {
    currentDomain = domain;
    sessionStart = Date.now();
    isTracking = true;

    console.log("Started tracking:", domain);
}


/* Stop tracking */
function stopTracking() {
    if (!isTracking) return;

    const durationSeconds =
        Math.floor((Date.now() - sessionStart) / 1000);

    if (durationSeconds >= 5) {
        console.log(
            `Tracked: ${currentDomain} for ${durationSeconds} sec`
        );

        // Later we add:
        // saveActivity()
        // calculateScore()
        // updateFocusScore()
    }

    currentDomain = null;
    sessionStart = null;
    isTracking = false;
}


/* Handle tab switching */
function handleTabChange(tab) {
    if (!tab || !tab.url) return;

    // Internal pages
    if (!isTrackable(tab.url)) {
        stopTracking();
        return;
    }

    const newDomain = extractDomain(tab.url);

    if (!newDomain) return;

    // Prevent duplicate trigger
    if (
        isTracking &&
        currentDomain === newDomain
    ) {
        return;
    }

    // Stop previous session
    stopTracking();

    // Start new session
    startTracking(newDomain);
}


/* Listen for active tab change */
chrome.tabs.onActivated.addListener(
    (activeInfo) => {
        chrome.tabs.get(
            activeInfo.tabId,
            (tab) => {
                console.log("Tab changed");
                handleTabChange(tab);
            }
        );
    }
);