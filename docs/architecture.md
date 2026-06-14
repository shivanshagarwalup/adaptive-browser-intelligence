# FocusLens - Architecture Documentation

## Project Overview

FocusLens is an Adaptive Browser Intelligence Platform designed to monitor user browsing activity, analyze website usage patterns, and eventually provide productivity scoring based on user-defined positive and negative website preferences.

The long-term goal is to build an intelligent browser assistant capable of measuring digital productivity and helping users improve focus.

Current development status: **Phase 1 Completed**

---

# Current Architecture (Phase 1)

Phase 1 focuses on accurate browser activity tracking inside a Chrome Extension.

Core features implemented:

- Detect browser tab switching
- Extract active website domain
- Measure time spent on websites
- Ignore short browsing sessions (< 5 seconds)
- Store browsing activity locally using Chrome Storage API
- Display tracked information through extension popup

No backend or machine learning integration has been added yet.

---

# Current Folder Structure

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

# System Flow (Phase 1)

```text
User switches browser tab
          ↓
Chrome Extension Event Triggered
(chrome.tabs.onActivated)
          ↓
background.js detects active tab
          ↓
Extract website domain
          ↓
Calculate time spent on previous website
          ↓
Ignore sessions below 5 seconds
          ↓
Create activity object
          ↓
Save activity in chrome.storage.local
          ↓
popup.js reads stored activity
          ↓
Display session count + last visited website
```

---

# Component Responsibilities

## 1. manifest.json

Purpose:

Defines extension metadata and permissions.

Responsibilities:

- Register service worker
- Configure extension popup
- Register extension icons
- Request Chrome permissions

Main permissions:

- tabs
- storage

---

## 2. background.js

Purpose:

Core event-driven tracking engine.

Responsibilities:

- Detect tab switching
- Extract active domain
- Start session timer
- Stop previous session timer
- Calculate session duration
- Save activity to local storage

Main APIs used:

- chrome.tabs.onActivated
- chrome.tabs.get
- chrome.storage.local

---

## 3. popup.html

Purpose:

Provides user interface for extension popup.

Responsibilities:

- Display extension status
- Show tracked session count
- Show last tracked website

---

## 4. popup.js

Purpose:

Reads locally stored activity data.

Responsibilities:

- Read activity_log from Chrome Storage
- Count browsing sessions
- Display latest tracked website

Main API:

- chrome.storage.local.get()

---

# Data Storage Structure

Current local storage structure:

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

# Technical Design Decisions

## Why Chrome Extension?

Chosen because browser activity must be captured in real time through browser APIs.

Alternative rejected:

- Web application

Reason:

Web apps cannot monitor browser tab activity.

---

## Why Local Storage First?

Local storage allows faster MVP development.

Benefits:

- No backend dependency
- Faster debugging
- Easier testing

Alternative postponed:

- Cloud database

---

## Why onActivated Event Only?

Initially tested:

```javascript
chrome.tabs.onUpdated
chrome.tabs.onActivated
```

Problem:

Both events caused incorrect timing calculations.

Example bug:

- 109 seconds tracked instead of actual 30 seconds

Final decision:

Only use:

```javascript
chrome.tabs.onActivated
```

Benefits:

- Stable timing logic
- Predictable event behavior

Tradeoff:

Same-tab URL changes are not tracked.

---

# Current Limitations

Known issues:

## 1. Same Tab Navigation Not Tracked

Example:

youtube.com/video1 → youtube.com/video2

Reason:

No chrome.tabs.onUpdated listener.

---

## 2. Browser Close Session Loss

Example:

User stays on website for 2 hours and closes browser.

Problem:

No final session save event.

Reason:

No session persistence handling yet.

---

## 3. No Productivity Scoring Yet

Current extension only tracks browsing activity.

No analysis exists yet.

---

# Future Roadmap

## Phase 2 - Local Scoring Engine

Features:

- User defines positive websites

Example:

```text
leetcode.com = +10
github.com = +8
```

- User defines negative websites

Example:

```text
instagram.com = -10
facebook.com = -7
```

System calculates:

```text
Focus Score = 74
```

No backend yet.

---

## Phase 3 - Backend Integration

Planned stack:

- Node.js
- Express.js
- MongoDB
- Docker

Features:

- Sync browsing data
- Store user scoring preferences
- API development

---

## Phase 4 - Machine Learning Layer

Planned features:

- Detect browsing behavior patterns
- Predict productivity trends
- Recommend better browsing habits

Possible models:

- Classification models
- Time series behavior analysis

---

# Technologies Used

Frontend:

- HTML
- JavaScript

Browser APIs:

- Chrome Extension API
- Chrome Storage API

Version Control:

- Git
- GitHub

Planned Technologies:

- Node.js
- Express.js
- MongoDB
- Docker
- Machine Learning Models

---

# Development Philosophy

Development follows incremental engineering approach.

Process:

Build smallest working system  
→ Test manually  
→ Debug event behavior  
→ Improve reliability  
→ Add new features gradually

Focus:

Correctness first, complexity later.