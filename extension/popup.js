/**
 * FocusLens - Popup Logic (popup.js)
 * Why this file exists: Orchestrates the dynamic presentation of metrics inside popup.html.
 * How it interacts with other files: Imports loadStoredActivity from utils.js to fetch tracked logs size.
 * What problem it solves: Connects the Chrome storage event logs to the HTML user interface safely.
 */

import { loadStoredActivity } from './utils.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const logs = await loadStoredActivity();
    const countElement = document.getElementById('session-count');
    if (countElement) {
      countElement.textContent = logs.length.toString();
    }
  } catch (error) {
    console.error('[FocusLens] Failed to retrieve session count for popup:', error);
  }
});
