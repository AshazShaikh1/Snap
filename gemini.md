# Project Constitution: "Snap" (MVP)

## 1. Goal
Build a deterministic React Native (Expo) Android application that helps users quit porn addiction.
**Core Mechanism:** It uses a native Android Accessibility Service (Kotlin) to monitor browser URLs. If a blocked URL is detected, it triggers a React Native Event that launches a full-screen, uncloseable overlay (The Panic Room) requiring a physical task to unlock.

## 2. Tech Stack & Aesthetic
- **Framework:** React Native (Expo Prebuild).
- **Styling:** NativeWind (Tailwind). **Aesthetic:** Brutalist, Military-grade, High-performance terminal. Vantablack backgrounds, sharp edges (rounded-none), monospace fonts for data, and Electric Blue/Warning Yellow accents.
- **Backend:** Supabase (Auth & Database).
- **Payments:** RevenueCat (Google Play Billing Wrapper).
- **Native Module:** Kotlin (for AccessibilityService & Overlay).

## 3. Data Schemas (Supabase)
Table `profiles`: `id` (uuid), `email` (text), `last_relapse_date` (timestamp), `subscription_status` (text), `settings_mode` (text).

## 4. Business Logic (Invariants)
1.  **Streak Logic:** Calculated dynamically on the client: `Date.now() - last_relapse_date`.
2.  **The Paywall Trigger:** "Auto-Blocker" is locked. Toggled ON only after purchasing 'snap_pro_access'.
3.  **The "Taste" Logic:** First install forces a "Live Fire" test (Triggered by keyword "danger") to demonstrate the blocker before asking for payment.
4.  **Native Bridge:** Kotlin Accessibility Service runs in background. Emits `DeviceEventEmitter` named `onBlockTriggered` to React Native.