# FocusLens

Adaptive Browser Intelligence Platform for Productivity Tracking and Behavioral Analysis

---

## Project Vision

FocusLens is a browser intelligence platform designed to analyze browsing behavior and eventually help users improve productivity through website scoring, usage analytics, and machine learning driven recommendations.

The long-term goal is to build a system capable of understanding how users spend time online and generating intelligent focus recommendations.

Current Status:

**Phase 1 Completed**

---

## Problem Statement

Most productivity applications only block websites or provide simple time tracking.

They do not understand whether a website is useful or harmful based on individual user goals.

Example:

For one user:

```text
youtube.com = distraction
```

For another user:

```text
youtube.com = learning resource
```

FocusLens aims to solve this by allowing adaptive productivity scoring based on user behavior and preferences.

---

## Current Features (Phase 1)

Implemented inside Chrome Extension.

Features completed:

- Browser tab activity tracking
- Website domain detection
- Session duration measurement
- Ignore short sessions below 5 seconds
- Local browser storage persistence
- Extension popup displaying tracking information
- Stable event driven architecture using Chrome APIs

Current system tracks:

```text
leetcode.com → 20 sec
github.com → 15 sec
youtube.com → 30 sec
```

Stored locally inside browser.

---

## System Architecture

Current architecture:

```text
User switches browser tab
        ↓
Chrome Extension detects tab switch
        ↓
background.js extracts website domain
        ↓
Time spent on previous website calculated
        ↓
Activity object created
        ↓
Data stored inside chrome.storage.local
        ↓
Popup reads stored data
        ↓
User sees tracked session data
```

Detailed architecture available in:

```text
docs/architecture.md
```

---

## Project Structure

```text
adaptive-browser-intelligence/

docs/
 └── architecture.md

extension/
 ├── icons/
 │    ├── icon-16.png
 │    ├── icon-48.png
 │    ├── icon-128.png
 │
 ├── background.js
 ├── manifest.json
 ├── popup.html
 ├── popup.js

README.md
```

---

## Current Technology Stack

Frontend:

- HTML
- JavaScript

Browser APIs:

- Chrome Extension API
- Chrome Storage API

Development Tools:

- Git
- GitHub

---

## Current Data Structure

```json
{
  "activity_log": [
    {
      "domain": "leetcode.com",
      "start_time": 1710000000000,
      "end_time": 1710000015000,
      "duration_seconds": 15
    }
  ]
}
```

---

## Development Challenges Solved

During development the following engineering problems were solved.

### 1. Chrome Extension Manifest Issues

Initial extension loading failed because of incorrect manifest structure.

Solved by fixing manifest configuration.

---

### 2. Service Worker Registration Failure

Initial service worker failed to initialize because of JavaScript syntax errors.

Solved by debugging service worker initialization.

---

### 3. Incorrect Time Tracking Bug

Initial implementation produced incorrect timing values.

Example:

```text
Actual browsing time = 30 sec
Tracked time = 109 sec
```

Root cause:

```javascript
chrome.tabs.onUpdated
chrome.tabs.onActivated
```

Both listeners interfered with timing logic.

Final fix:

Use only:

```javascript
chrome.tabs.onActivated
```

Result:

Stable timing calculations.

---

## Roadmap

### Phase 2 - Adaptive Scoring Engine

Users define productive and non productive websites.

Example:

```text
leetcode.com = +10
github.com = +8
instagram.com = -10
facebook.com = -7
```

System calculates:

```text
Focus Score = 82
```

---

### Phase 3 - Backend Integration

Planned stack:

- Node.js
- Express.js
- MongoDB
- Docker

Features:

- User account system
- Cloud synchronization
- API development
- Persistent analytics storage

---

### Phase 4 - Machine Learning Integration

Planned features:

- Behavioral pattern analysis
- Productivity trend detection
- Recommendation engine
- Intelligent focus improvement suggestions

Possible models:

- Classification models
- Time series analysis

---

## Future Vision

Final system goal:

```text
Track browser activity
        ↓
Measure productive vs non productive browsing
        ↓
Generate productivity score
        ↓
Analyze browsing patterns
        ↓
Recommend behavioral improvements
```

---

## Development Philosophy

Project is being developed incrementally.

Process followed:

```text
Build smallest working system
        ↓
Test manually
        ↓
Debug architecture issues
        ↓
Stabilize implementation
        ↓
Add complexity gradually
```

Focus:

```text
Correctness first
Complexity later
```

---

## Author

Built as a systems engineering and machine learning oriented project focused on browser intelligence and productivity analytics.