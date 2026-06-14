

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
