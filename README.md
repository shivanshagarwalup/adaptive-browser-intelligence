# FocusLens - Adaptive Browser Intelligence Platform (Phase 1)

FocusLens is a browser extension-based productivity intelligence system that tracks user browsing behavior, records website usage patterns, and computes accurate domain-level focus time metrics. 

Phase 1 focuses exclusively on a robust browser event capture engine with local persistence.

---

## Features

- **Domain-Level Tracking**: Automatically parses full URLs to track time spent per domain (e.g. `leetcode.com`, `youtube.com`).
- **Tab Switching & Navigation Capture**: Triggers calculations when the user switches tabs or navigates to a new site within the same tab.
- **Service Worker Resiliency**: Persists active tracking states in `chrome.storage.local` to survive background worker suspension.
- **Window Focus Management**: Pauses and saves logs when the browser window loses focus to other desktop applications.
- **System Idle Protection**: Suspends tracking if the user is inactive for more than 60 seconds (no keyboard/mouse movements) or locks the screen.
- **Clean Hygiene**: Ignores empty tabs, local files, and browser internal/extension URLs.

---

## Project Structure

```
adaptive-browser-intelligence/
 ├── extension/
 │    ├── manifest.json       # Manifest configuration (Manifest V3)
 │    ├── background.js       # Background event monitoring service worker
 │    ├── constants.js        # Configurable keys, limits, and ignore lists
 │    ├── utils.js            # URL parsing and storage utilities
 │    ├── popup.html          # Toolbar popup UI
 │    ├── popup.js            # Stats updater for popup UI
 │    └── icons/              # Extension toolbar and listing icons
 ├── docs/
 │    └── architecture.md     # In-depth architectural design
 └── README.md                # Project documentation (This file)
```

---

## Installation & Setup

To load the extension in Google Chrome:

1. Open **Google Chrome** and navigate to `chrome://extensions/`.
2. Enable **Developer mode** by toggling the switch in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the `extension` folder located within your local `adaptive-browser-intelligence` workspace directory.
5. The **FocusLens** extension card will appear and the extension is now active.

---

## Verification & Testing

1. **Verify UI**:
   - Click the extension puzzle icon in the Chrome toolbar and pin **FocusLens**.
   - Click the FocusLens icon to view the popup showing **FocusLens Active** and **Tracked Sessions**.
2. **Observe Activity Tracking**:
   - Open a website (e.g., `leetcode.com`) and browse for 15 seconds.
   - Switch to another website (e.g., `youtube.com`) or switch tabs.
   - Click the FocusLens icon to check if the **Tracked Sessions** count has increased.
3. **Inspect Local Storage Logs**:
   - Go to `chrome://extensions/`.
   - Click the **service worker** link on the FocusLens card to open the developer tools console.
   - Run the following command in the console to inspect the structured log of session events:
     ```javascript
     chrome.storage.local.get(null, console.log);
     ```
   - You will see the event log array structure:
     ```json
     {
       "focuslens_activity_log": [
         {
           "domain": "leetcode.com",
           "start_time": 1710000000,
           "end_time": 1710000015,
           "duration_seconds": 15
         }
       ]
     }
     ```
