# Melyn Community Notices App — Master AI Knowledge Base & Context

> **Prompt for Gen AI**: You are an expert mobile developer and technical reviewer analyzing the **Melyn Community Notices** mobile application. Use the comprehensive specifications, architectural patterns, code references, edge-case rationale, and Q&A entries in this document to answer any question about this project with 100% precision.

---

## 1. Executive Summary & Purpose

- **Organization / Domain**: **Melyn** is a mobile community platform designed for First Nations communities.
- **App Purpose**: Enables community members to stay informed with vital updates across four core categories: **Emergency Alerts**, **Community Events**, **Service Announcements**, and **General Updates**.
- **Tech Stack**:
  - **Framework**: React Native (`0.86.3`) with **Expo SDK 57** (`~57.0.24`).
  - **Language**: TypeScript (`~6.0.3`) in strict mode.
  - **Routing**: **Expo Router** (`~57.0.22`) with typed, file-based routing (`src/app/`).
  - **Storage**: `@react-native-async-storage/async-storage` (`2.2.0`).
  - **Icons**: `@expo/vector-icons` (`^15.0.2` - Feather icon set).
  - **React Core**: React `19.2.3`.
- **Repository Link**: [https://github.com/Nagu066/Community-App](https://github.com/Nagu066/Community-App)

---

## 2. Assessment Requirements & Scope (TASK.pdf)

The application was built according to the official **Melyn Take-Home Task**:
1. **Screen 1 — Notices List**:
   - Reverse-chronological order (newest notices first).
   - Paginated loading (10 items per page) as user scrolls to the bottom.
   - Pull-to-refresh functionality.
   - Category filtering: `all`, `emergency`, `event`, `service`, `general`.
   - Distinct visual treatment for high-priority emergency alerts.
   - Visual distinction between read and unread notices.
   - Tapping an item opens the Notice Detail screen.
2. **Screen 2 — Notice Detail**:
   - Displays title, department, published date, notice body, and attached image (if present).
   - Opening a notice marks it as read, and this read state **must persist across app restarts**.
3. **Data Layer (Mock API)**:
   - Must read locally from `notices.json` (45 notices). Do not call a real remote backend.
   - Emulate realistic network behavior: returns 1 page (10 items) at a time with an artificial delay (500ms).
   - Emulate network instability: roughly 1 in 5 requests fail with an error (~20% random drop).
   - Must include a simple toggle to turn failures on/off for smooth evaluation.
4. **Key Evaluated Behaviors**:
   - Loading skeletons, empty states, screen-level error states, and pagination error recovery.
   - Poor/offline network handling: display previously cached notices, clearly flag them as potentially stale, and automatically recover when network succeeds.
   - Clean architectural separation of concerns (UI, state hooks, storage, data access).
   - Thoughtful handling of 5 specific deliberate edge cases embedded in `notices.json`.

---

## 3. Architecture & File Structure

The project strictly adheres to **Separation of Concerns (SoC)**, decoupling presentation, state management, persistent storage, and data access:

```text
/
├── assets/                  # App icons, splash images, and demo walkthrough video
│   └── demo.mp4             # 37MB H.264 screen recording of iPhone 17 Pro walkthrough
├── notices.json             # 45 static notice records containing deliberate edge cases
├── package.json             # Dependencies and scripts (expo start, ios, android, lint)
├── README.md                # Project documentation, video player, decisions & trade-offs
├── PROJECT_CONTEXT.md       # Master AI Context Document (this file)
└── src/
    ├── app/                 # Expo Router route screens & layout
    │   ├── _layout.tsx      # Root Stack navigator, status bar, safe area provider
    │   ├── index.tsx        # Screen 1: Notices List feed, search/dev pill, filters
    │   └── notice/
    │       └── [id].tsx     # Screen 2: Notice Detail screen (dynamic route by ID)
    ├── components/
    │   ├── notices/
    │   │   ├── DevControlsModal.tsx     # In-app dev modal (toggle failures, reset read status)
    │   │   ├── ListStates.tsx           # Skeleton loaders, empty state, pagination errors
    │   │   ├── NoticeCard.tsx           # Feed card item with priority/read/tag styles
    │   │   ├── NoticeCategoryFilter.tsx # Horizontal scrollable category filter pills
    │   │   ├── NoticeImage.tsx          # Resilient image with loader and broken-URL fallback
    │   │   └── StaleBanner.tsx          # Banner shown when displaying cached data on network drop
    │   └── ui/
    │       └── ScreenHeader.tsx         # Reusable top navigation header with Back action
    ├── hooks/
    ├── useNotices.ts        # Custom hook: pagination, filtering, refresh, stale fallback, dev controls
    │   └── useNoticeDetail.ts   # Custom hook: notice detail fetching & automatic read persistence
    ├── services/
    │   ├── api/
    │   │   └── noticesApi.ts    # In-memory mock API (delay, 1/5 failure, pagination, pre-sort)
    │   └── storage/
    │       └── noticeStorage.ts # AsyncStorage persistence for read IDs and cached notices
    ├── types/
    │   └── notice.ts            # TypeScript interfaces (Notice, PaginatedNoticesResponse, etc.)
    └── utils/
        └── noticeUtils.ts       # Date formatting (local timezone), category colors, expiry helpers
```

---

## 4. Data Models & Schemas (`src/types/notice.ts`)

```typescript
export type NoticeCategory = 'all' | 'emergency' | 'event' | 'service' | 'general';
export type NoticePriority = 'normal' | 'high';

export interface Notice {
  id: string;               // e.g. "ntc_0004"
  title: string;            // Notice headline
  body: string;             // Notice content text (can be empty string "")
  category: 'emergency' | 'event' | 'service' | 'general';
  priority: NoticePriority; // 'normal' | 'high'
  department: string;       // e.g. "Health Centre", "Band Office", "Recreation"
  published_at: string;     // ISO 8601 UTC timestamp, e.g. "2026-09-20T06:00:00Z"
  expires_at: string | null;// ISO 8601 UTC timestamp or null
  image_url: string | null; // Image URL string or null
}

export interface PaginatedNoticesResponse {
  items: Notice[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface NoticesFilterOptions {
  category?: NoticeCategory;
  page?: number;
  pageSize?: number;
}
```

---

## 5. Mock API Layer (`src/services/api/noticesApi.ts`)

- **Data Source**: Imports `notices.json` directly.
- **Initial Sort**: Automatically pre-sorted reverse-chronologically on module load:
  ```typescript
  const allNotices: Notice[] = [...rawNoticesData.notices].sort((a, b) => {
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });
  ```
- **Simulated Latency**: Injects an artificial `500ms` delay (`delay(500)`) on every network call to mirror realistic mobile asynchronous latency.
- **1-in-5 Failure Rate**:
  ```typescript
  if (simulateFailures && Math.random() < 0.2) {
    throw new Error('Network error: Failed to fetch community notices. Please try again.');
  }
  ```
- **Live Failure Switch**: `ApiConfig.setSimulateFailures(boolean)` allows the developer to turn failures off or on in real-time via the in-app UI.
- **Endpoints**:
  - `fetchNotices({ category, page, pageSize })`: Filters by category (if not `'all'`), slices by `(page - 1) * pageSize` to `startIndex + pageSize`, and returns `{ items, page, pageSize, total, hasMore }`.
  - `fetchNoticeById(id)`: Returns individual notice with a `250ms` delay or throws 404 if missing.

---

## 6. Local Storage & Persistence (`src/services/storage/noticeStorage.ts`)

Uses React Native's `@react-native-async-storage/async-storage`:
1. **Read Status Storage (`@melyn_read_notices_v1`)**:
   - Stored as a JSON serialized string array of unique notice IDs (`string[]`).
   - `getReadNoticeIds()`: Retrieves the array on app mount.
   - `markNoticeAsRead(id)`: Appends `id` to the array if not already present and saves to disk.
   - `clearReadNotices()`: Wipes the key for dev testing.
   - **Persistence Guarantee**: Because read IDs are written directly to `AsyncStorage`, read markers survive app kills and reboots.
2. **Offline Notice Cache (`@melyn_cached_notices_v1`)**:
   - `saveCachedNotices(notices)`: Persists the latest successfully loaded page 1 notices.
   - `getCachedNotices()`: When a network error occurs, loads the cached list to allow uninterrupted reading.

---

## 7. State Management & Hooks

### `useNotices.ts`
Manages the feed state on Screen 1:
- **`notices`**: Array of currently rendered notices.
- **`category`**: Currently active filter (`'all'`, `'emergency'`, `'event'`, `'service'`, `'general'`). Changing category immediately resets pagination to page 1 and fetches fresh data.
- **`loadMore()`**: Triggered by FlatList's `onEndReached`. Guards against duplicate in-flight requests using `isFetchingRef`. Appends page `N+1` items to the existing array.
- **`paginationError`**: If an infinite-scroll request fails due to the 1-in-5 simulation, the feed remains intact, and a dedicated inline retry banner appears at the footer of the list (`ListPaginationError`) without losing existing loaded items.
- **`refresh()`**: Triggered by pull-to-refresh. Fetches page 1 fresh and replaces data.
- **`isStale`**: Set to `true` when a fetch fails but cached data from `AsyncStorage` is successfully displayed. Triggers the top `StaleBanner`.
- **`readIds`**: React `Set<string>` reflecting persisted read IDs. Synchronized via `useFocusEffect` whenever navigating back from Notice Detail.

### `useNoticeDetail.ts`
Manages Screen 2:
- Accepts `id` from route params.
- Calls `fetchNoticeById(id)`.
- Upon successful retrieval, automatically triggers `NoticeStorage.markNoticeAsRead(id)`.
- Provides loading spinner, error state with retry button, and notice data.

---

## 8. The 5 Deliberate Edge Cases & Implementation Choices

`TASK.pdf` deliberately included 5 real-world edge cases in `notices.json`. Here is exactly how each is handled and why:

| Notice ID | Edge Case Description | How It is Handled in the App | Design Rationale |
| :--- | :--- | :--- | :--- |
| **`ntc_0004`** | **Very Long Title** *(126 characters)* | In feed card: `numberOfLines={3}` with `ellipsizeMode="tail"`. In detail view: Rendered fully with generous line height (`28px`) and 20px typography. | Prevents list cards from blowing out vertically and ruining feed rhythm, while ensuring the full title is readable in detail view. |
| **`ntc_0008`** | **Empty Body** *(`body: ""`, Recreation dept)* | In detail view: Displays a dedicated card with an icon and clear message: *"No Additional Body Content Provided — The Recreation department did not include additional written details for this notice. If you have questions, please contact the band administration office."* | An empty blank screen looks like a bug or broken API. A helpful fallback reassures users that no details were omitted. |
| **`ntc_0012`** | **Already Expired Notice** *(`expires_at: "2026-09-01T00:00:00Z"`)* | Dynamically compared against `Date.now()`. In feed: Card is slightly dimmed with an `"Expired"` badge. In detail: Renders an amber archive warning box stating the notice has expired and is retained for records. | Allows community records to remain auditable while preventing members from acting on outdated deadlines or events. |
| **`ntc_0016`** | **Broken Image URL** *(`https://example.invalid/broken.jpg`)* | Wrapped in custom `NoticeImage.tsx` with `onError` listener. Upon error, seamlessly swaps to a branded neutral placeholder card with category vector icon. | Prevents uncaught React Native image exceptions and avoids blank gaps or layout shifts. |
| **`ntc_0020`** | **Future Published Date** *(`published_at: "2026-09-26T09:00:00Z"`)* | Identified via `isNoticeFuture(notice)`. Marked with an amber `"Upcoming Notice"` badge showing release date. | Prevents confusion when administrators schedule announcements in advance; community members understand it takes effect in the future. |

---

## 9. Date Formatting, Time Zones, and Sorting Logic

- **Backend Time Zone**: ISO 8601 UTC strings with trailing **`Z`** (Zulu / GMT +00:00), e.g. `"2026-09-23T07:00:00Z"`.
- **Frontend Presentation**:
  - `formatNoticeDate(isoString)` parses the UTC string via `new Date(isoString)` and formats it using `toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })`.
  - This **automatically converts UTC to the user's device local timezone** (e.g. `07:00:00Z` renders as `12:30 PM` in IST UTC+5:30, or `3:00 AM` in EDT UTC-4).
- **Why 11:30 AM appears before 5:30 AM on the same day**:
  - The feed is sorted **Newest First (Reverse Chronological / Descending order)**: `new Date(b.published_at).getTime() - new Date(a.published_at).getTime()`.
  - On September 20, 2026, **11:30 AM is later in the day (more recent) than 5:30 AM**, so it rightly sits higher in the feed.

---

## 10. Developer Controls & Testing Modal

Accessible via the **"1/5 Failures" / "Reliable API"** pill button on the top-right of the home screen:
1. **Toggle 1-in-5 Failures Switch**: Turns `ApiConfig.setSimulateFailures()` on/off. When off, all API calls succeed 100% of the time, allowing reviewers to browse without random network drops.
2. **Reset Read Statuses**: Clears the persisted read ID array in `AsyncStorage` and updates the count on screen.
3. **Storage Inspector**: Shows live count of how many notices are currently marked as read.

---

## 11. Production Readiness: What to Add Before Shipping

1. **Automated Testing Suite**:
   - Unit tests (Jest) for `noticesApi.ts` pagination slicing, `noticeStorage.ts` persistence, and `noticeUtils.ts` date math.
   - Component tests (React Native Testing Library) for `NoticeCard`, `NoticeCategoryFilter`, and edge cases.
   - End-to-end flows (Maestro or Detox) testing infinite scroll, offline mode, and mark-as-read survival.
2. **Crash & Error Reporting**:
   - Integration of **Sentry for React Native** (`@sentry/react-native`) with breadcrumbs and user session replay.
3. **Emergency Push Notifications**:
   - Integration with **Expo Notifications** and APNs / Firebase Cloud Messaging (FCM) to deliver high-priority emergency alerts immediately when published.
4. **Build & Release Pipelines**:
   - Cloud CI/CD via **EAS Build** (`eas build`) for iOS App Store and Android Play Store binaries.
   - **EAS Update** (`eas update`) for over-the-air bug fixes without waiting for app store reviews.
5. **Observability & Analytics**:
   - PostHog or Segment telemetry for tracking notice engagement, drop-off rates, and offline fallback hits.

---

## 12. Future Enhancements (With More Time)

- **Search & Advanced Filtering**: Client-side full-text search with debounce across titles, bodies, and departments.
- **Bookmarks & Offline Reading**: A dedicated "Saved Notices" tab allowing users to pin essential notices for offline reference.
- **Accessibility & Localization**:
  - WCAG AA compliance with dynamic system font scaling and high-contrast color modes.
  - Multi-language support, including Indigenous community languages alongside English.
- **Background Synchronization**: Background fetch (`expo-background-fetch`) to pre-cache new notices before the user opens the app.

---

## 13. Direct AI Q&A Reference Guide

When answering user questions, use these definitive answers:

- **Q: How do you run the app locally?**
  - **A**: Run `npm install`, then `npx expo start`. Press `i` for iOS Simulator, `a` for Android Emulator, `w` for Web, or scan the QR code using the Expo Go mobile app.
- **Q: Where is read status stored, and does it survive restarts?**
  - **A**: Yes. It is stored in `AsyncStorage` under the key `@melyn_read_notices_v1` as a JSON array of notice IDs. It is reloaded into a `Set` on app start and re-synced on screen focus.
- **Q: How does pagination work?**
  - **A**: The mock API slices the pre-sorted array 10 items at a time (`startIndex = (page - 1) * pageSize`). When the user scrolls near the end of the `FlatList`, `onEndReached` invokes `loadMore()`, fetching page `N+1` and appending it to state.
- **Q: How does the app handle offline or poor network?**
  - **A**: Whenever page 1 successfully loads, it is cached in `AsyncStorage` under `@melyn_cached_notices_v1`. If a future request fails, `useNotices` falls back to the cached notices and displays `StaleBanner` at the top with a manual "Retry" action.
- **Q: How are high-priority notices distinguished?**
  - **A**: High-priority notices (`priority: "high"`) render with a bold red emergency banner at the top (`"⚠️ HIGH PRIORITY ALERT"`), an amber/red border highlight, and prominent iconography.
- **Q: How are categories filtered?**
  - **A**: Via `NoticeCategoryFilter`. Selecting a category calls `setCategory(newCategory)`, which immediately resets the page count to 1, fetches the filtered dataset, and renders an empty state if no notices match.
- **Q: How is the 1-in-5 failure simulated and controlled?**
  - **A**: `noticesApi.ts` checks `simulateFailures && Math.random() < 0.2`. It can be toggled on/off in real time via the Developer Controls Modal accessible from the top-right button on the home screen.
