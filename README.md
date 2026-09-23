# Melyn Community Notices Mobile App

A React Native & Expo mobile application built for First Nations community members to stay informed with emergency alerts, events, service announcements, and general community updates.

---

## 📱 App Demo Walkthrough

A complete screen recording of the app running on an **iPhone 17 Pro** simulator, showcasing all features, edge cases, filtering, and developer controls:

* 📥 **[Download & Watch Demo Video (`assets/demo.mp4`)](assets/demo.mp4)** *(37 MB)*

<div align="center">
  <video src="assets/demo.mp4" controls width="100%" style="max-height: 640px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
    <p>Your browser does not support HTML5 video. <a href="assets/demo.mp4">Click here to download and view the demo video directly</a>.</p>
  </video>
</div>

---

## 1. How to Run It

### Prerequisites
- Node.js (v18+)
- npm or bun

### Step-by-Step
1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the Expo development server**:
   ```bash
   npx expo start
   ```

3. **Launch on a Simulator / Device**:
   - **iOS Simulator**: Press `i` in the terminal (macOS with Xcode required).
   - **Android Emulator**: Press `a` in the terminal (Android Studio & emulator running).
   - **Physical Device**: Scan the QR code with the Expo Go app (iOS Camera or Android Expo Go).
   - **Web Browser** (quick inspection): Press `w` in the terminal.

---

## 2. Main Decisions and Trade-offs (Including Edge Cases)

### Architectural Decisions
- **Separation of Concerns**: Data access (`src/services/api/noticesApi.ts`), local persistence (`src/services/storage/noticeStorage.ts`), state management (`src/hooks/useNotices.ts`, `src/hooks/useNoticeDetail.ts`), and presentation UI (`src/components/notices/`, `src/app/`) are kept strictly separated so any layer can be swapped or extended without impacting the others.
- **Pagination & Sorting**: Items are pre-sorted newest first (`published_at` descending) and sliced 10 at a time with an artificial 500ms network delay.
- **Offline & Poor Network Recovery**: When a network request fails, the app falls back to cached notices from `AsyncStorage` and displays a non-intrusive **Offline / Stale Notices banner** with a 1-tap **Retry** action. When connectivity recovers, the fresh data smoothly replaces stale content.
- **Read Notice Persistence**: Notice reads are persisted to `AsyncStorage` as a set of IDs, ensuring read statuses survive app restarts.
- **Interactive Developer Controls**: An in-app Developer Modal (accessible via the top-right button on the home screen) allows reviewers to toggle the 1-in-5 failure simulation on/off, clear read history, or inspect cached data.

### Real-World Edge Case Handling
1. **Very Long Title (`ntc_0004`)**:
   - *List screen*: Constrained with `numberOfLines={3}` and ellipsis to prevent cards from becoming unpredictably tall while preserving legibility.
   - *Detail screen*: Displayed in full with proportional line height and spacing.
2. **Empty Body (`ntc_0008`)**:
   - Instead of displaying a broken blank space, the app renders a dedicated fallback card: *"No Additional Body Content Provided — The Recreation department did not include additional written details for this notice. If you have questions, please contact the band administration office."*
3. **Already Expired Notice (`ntc_0012`, `ntc_0044`, etc.)**:
   - Evaluated dynamically against `Date.now()`. An *"Expired"* badge is rendered, the card is slightly dimmed to communicate that it is historical, and the detail view includes a warning banner noting the notice is kept for archival records.
4. **Image URL That Fails to Load (`ntc_0016` `https://example.invalid/broken.jpg`)**:
   - Handled via `NoticeImage` with an `onError` listener. Upon failure, it gracefully displays a branded placeholder indicating image preview is unavailable instead of an empty space or layout jump.
5. **Published Date in the Future (`ntc_0020` `2026-09-26T09:00:00Z`)**:
   - Marked with an amber *"Upcoming Notice"* badge, displaying the scheduled release date clearly to differentiate it from past notices.

---

## 3. What to Add Before Shipping to Real Users

1. **End-to-End & Unit Testing**:
   - Automated Jest unit tests for the mock API pagination and storage persistence.
   - Component tests using React Native Testing Library.
   - Maestro or Detox E2E tests for pull-to-refresh, infinite scroll, and offline recovery flows.
2. **Crash Reporting & Error Monitoring**:
   - Integrate **Sentry for React Native** (`@sentry/react-native`) for real-time error tracking and performance profiling.
3. **Push Notifications**:
   - Configure **Expo Notifications** and APNs/FCM for instant alerts on `high` priority emergency announcements.
4. **Native Release Pipelines & Over-The-Air (OTA) Updates**:
   - EAS Build (`eas build`) for automated iOS App Store and Android Google Play builds.
   - EAS Update (`eas update`) for rapid critical bug fixes without app store review.
5. **Observability & Analytics**:
   - PostHog or Segment to track notice engagement, popular categories, and network failure rates.

---

## 4. What to Do Differently with More Time

- **Full-Text Search & Filtering**: Add a search bar with client-side indexing to quickly search notices by keywords, band departments, or date ranges.
- **Saved / Bookmarked Notices**: Let community members bookmark key notices (e.g. clinic dates, garbage schedules) for quick reference in an offline "Saved" tab.
- **Accessibility & Language Localization**:
   - Ensure WCAG AA compliance, dynamic font scaling support, and high-contrast color mode.
   - Multi-language support (Indigenous language translations alongside English).
- **Optimistic UI Updates**: Background synchronization with background fetch tasks (`expo-background-fetch`) so notices are already pre-loaded when members open the app.

---

## 5. What to Test First

1. **Pagination Boundary Conditions**:
   - Verify page slicing logic: page 1 returns items 0–9, page 2 returns 10–19, last page returns remainder, and `hasMore` flips to `false` when exhausted.
   - Verify category filtering resets pagination to page 1.
2. **Storage Persistence**:
   - Verify that marking notice `ntc_0020` as read persists in `AsyncStorage` and reloads correctly on fresh app mount.
3. **Failure & Offline Recovery**:
   - Test that when API throws an error on initial load with a warm cache, cached notices are loaded and `isStale` is set to `true`.
   - Test that the inline "Retry Loading More" button successfully resumes pagination without duplicating entries.
4. **Edge Case Rendering**:
   - Test `ntc_0008` renders empty body fallback text.
   - Test `ntc_0016` triggers error handler and shows fallback graphic without throwing uncaught errors.
