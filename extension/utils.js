/**
 * FocusLens - Extension Utilities
 * Why this file exists: Encapsulates pure helper functions for processing URLs and handling chrome.storage operations.
 * How it interacts with other files: Used by background.js to validate, extract, and write activities; and by popup.js to fetch log stats.
 * What problem it solves: Keeps the core event listeners in background.js clean and untangled from parsing and storage API calls.
 */

import { STORAGE_KEYS, LIMITS, EXCLUDED_PROTOCOLS, EXCLUDED_DOMAINS } from './constants.js';

/**
 * Extracts the primary domain name from a URL string.
 * Example: "https://leetcode.com/problems/two-sum" -> "leetcode.com"
 * @param {string} urlString
 * @returns {string|null}
 */
export function extractDomain(urlString) {
  if (!urlString) return null;
  try {
    const url = new URL(urlString);
    let hostname = url.hostname;
    // Strip "www." prefix if present
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }
    return hostname || null;
  } catch (error) {
    console.error('Failed to extract domain from URL:', urlString, error);
    return null;
  }
}

/**
 * Validates whether a URL should be tracked.
 * Ignores browser internals, extensions, local files, and generic new tabs.
 * @param {string} urlString
 * @returns {boolean}
 */
export function isValidTrackableUrl(urlString) {
  if (!urlString) return false;
  try {
    const url = new URL(urlString);
    
    // Check if the protocol is excluded
    if (EXCLUDED_PROTOCOLS.includes(url.protocol)) {
      return false;
    }
    
    const hostname = url.hostname.toLowerCase();
    
    // Exclude empty hostnames
    if (!hostname) {
      return false;
    }
    
    // Exclude specific domains
    if (EXCLUDED_DOMAINS.some(domain => hostname.includes(domain))) {
      return false;
    }
    
    return true;
  } catch (error) {
    // If URL parsing fails, it's not a valid trackable web URL
    return false;
  }
}

/**
 * Retrieves the array of stored activity events.
 * @returns {Promise<Array>}
 */
export async function loadStoredActivity() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEYS.ACTIVITY_LOG], (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error fetching activity log:', chrome.runtime.lastError);
        resolve([]);
      } else {
        resolve(result[STORAGE_KEYS.ACTIVITY_LOG] || []);
      }
    });
  });
}

/**
 * Appends a completed activity event to the history logs.
 * Truncates history size to MAX_ACTIVITY_HISTORY if exceeded.
 * @param {Object} event
 * @param {string} event.domain
 * @param {number} event.start_time
 * @param {number} event.end_time
 * @param {number} event.duration_seconds
 * @returns {Promise<boolean>}
 */
export async function saveActivityEvent(event) {
  if (!event || !event.domain || event.duration_seconds <= 0) {
    return false;
  }
  
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEYS.ACTIVITY_LOG], (result) => {
      if (chrome.runtime.lastError) {
        console.error('Error loading activity logs during save:', chrome.runtime.lastError);
        resolve(false);
        return;
      }
      
      const logs = result[STORAGE_KEYS.ACTIVITY_LOG] || [];
      logs.push(event);
      
      // Enforce the size limit
      if (logs.length > LIMITS.MAX_ACTIVITY_HISTORY) {
        logs.splice(0, logs.length - LIMITS.MAX_ACTIVITY_HISTORY);
      }
      
      chrome.storage.local.set({ [STORAGE_KEYS.ACTIVITY_LOG]: logs }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving activity event:', chrome.runtime.lastError);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  });
}
