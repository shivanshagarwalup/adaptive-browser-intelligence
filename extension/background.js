/**
 * FocusLens - Service Worker (background.js)
 * Why this file exists: Serves as the persistent/ephemeral event capture engine for the extension.
 * How it interacts with other files: Uses constants.js and utils.js to process tab/window events and store logs.
 * What problem it solves: Handles Chrome tab events and manages the active tracking state.
 * It is fully designed to survive Service Worker termination by maintaining state inside chrome.storage.local.
 */

import { STORAGE_KEYS } from './constants.js';
import { extractDomain, isValidTrackableUrl, saveActivityEvent } from './utils.js';

/**
 * Finalizes the active session (if any), computes the duration, and appends it to the history log.
 * @returns {Promise<void>}
 */
async function finalizeActiveSession() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEYS.CURRENT_SESSION], async (result) => {
      const currentSession = result[STORAGE_KEYS.CURRENT_SESSION];
      if (currentSession) {
        const now = Math.floor(Date.now() / 1000);
        const duration = now - currentSession.start_time;

        if (duration > 0) {
          const event = {
            domain: currentSession.domain,
            start_time: currentSession.start_time,
            end_time: now,
            duration_seconds: duration
          };
          await saveActivityEvent(event);
          console.log(`[FocusLens] Logged: ${event.domain} - ${event.duration_seconds}s`);
        }

        // Remove active session from storage
        chrome.storage.local.remove([STORAGE_KEYS.CURRENT_SESSION], () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
}

/**
 * Commences tracking a new domain session.
 * @param {string} domain
 * @returns {Promise<void>}
 */
async function startNewSession(domain) {
  const newSession = {
    domain: domain,
    start_time: Math.floor(Date.now() / 1000)
  };
  return new Promise((resolve) => {
    chrome.storage.local.set({ [STORAGE_KEYS.CURRENT_SESSION]: newSession }, () => {
      console.log(`[FocusLens] Started tracking: ${domain}`);
      resolve();
    });
  });
}

/**
 * Checks the current system state (focused window and active tab) and runs transitions.
 */
async function updateTrackingState() {
  // Query active tab in the last focused browser window
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
    if (chrome.runtime.lastError) {
      console.error('[FocusLens] Tab query error:', chrome.runtime.lastError);
      return;
    }

    const activeTab = tabs && tabs[0];

    // Check if the browser window itself is currently focused
    chrome.windows.getLastFocused((window) => {
      const isWindowFocused = window && window.focused;

      // We only track if browser is focused AND a valid tab is active
      if (isWindowFocused && activeTab && activeTab.url) {
        const url = activeTab.url;

        if (isValidTrackableUrl(url)) {
          const domain = extractDomain(url);

          if (!domain) {
            // Cannot extract domain; clear active tracking state
            await finalizeActiveSession();
            return;
          }

          chrome.storage.local.get([STORAGE_KEYS.CURRENT_SESSION], async (result) => {
            const currentSession = result[STORAGE_KEYS.CURRENT_SESSION];

            if (currentSession) {
              if (currentSession.domain === domain) {
                // User is still browsing the same domain, do nothing
              } else {
                // User changed domains: complete old session, start new session
                await finalizeActiveSession();
                await startNewSession(domain);
              }
            } else {
              // No active session: start new session
              await startNewSession(domain);
            }
          });
        } else {
          // Untrackable page (e.g., chrome://) -> stop tracking active tab
          finalizeActiveSession();
        }
      } else {
        // Browser is minimized or out of focus -> finalize active session
        finalizeActiveSession();
      }
    });
  });
}

// -------------------------------------------------------------
// EVENT LISTENERS
// -------------------------------------------------------------

// 1. Triggers when the active tab in a window changes
chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('[FocusLens] Tab activated:', activeInfo.tabId);
  updateTrackingState();
});

// 2. Triggers when a tab is updated (e.g. user navigates to a new URL)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    console.log('[FocusLens] Tab URL changed:', changeInfo.url);
    updateTrackingState();
  }
});

// 3. Triggers when the active window changes (losing focus to desktop or other app)
chrome.windows.onFocusChanged.addListener((windowId) => {
  console.log('[FocusLens] Window focus changed:', windowId);
  updateTrackingState();
});

// 4. Triggers when the user goes idle (no mouse/keyboard input) or locks their screen
chrome.idle.onStateChanged.addListener((state) => {
  console.log('[FocusLens] Idle state changed:', state);
  if (state === 'idle' || state === 'locked') {
    finalizeActiveSession();
  } else if (state === 'active') {
    updateTrackingState();
  }
});

// 5. Triggers when the extension is installed, updated, or browser starts up
chrome.runtime.onInstalled.addListener(() => {
  // Set detection interval to 60 seconds (1 minute of absolute inactivity to mark as idle)
  chrome.idle.setDetectionInterval(60);
  console.log('[FocusLens] Extension initialized. Idle threshold set to 60s.');
  
  // Clear any dangling active session state from a previous session
  chrome.storage.local.remove([STORAGE_KEYS.CURRENT_SESSION]);
});

// Execute startup synchronization in case tabs are already open when background loads
updateTrackingState();
