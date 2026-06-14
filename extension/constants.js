/**
 * FocusLens - Extension Constants
 * Why this file exists: Centralizes all configuration limits, storage keys, and protocol exclusions.
 * How it interacts with other files: Imported by utils.js and background.js to enforce system rules.
 * What problem it solves: Prevents duplication of configuration strings and makes policy tuning easy.
 */

export const STORAGE_KEYS = {
  ACTIVITY_LOG: 'focuslens_activity_log',
  CURRENT_SESSION: 'focuslens_current_session'
};

export const LIMITS = {
  MAX_ACTIVITY_HISTORY: 5000
};

export const EXCLUDED_PROTOCOLS = [
  'chrome:',
  'chrome-extension:',
  'edge:',
  'about:',
  'file:',
  'devtools:',
  'view-source:'
];

export const EXCLUDED_DOMAINS = [
  'newtab',
  'extensions'
];
