# Dev Log: Phase 3.3 Native Permissions Flow

## Goal
Implement a bridge between React Native and the Android OS to securely query if the user has manually enabled the "Snap" Accessibility Service. If they haven't, display a dynamic warning banner on the Home dashboard with a one-tap deep link into Android Settings.

## Changes Made

### 1. Kotlin Native Methods (`android/app/src/main/java/com/anonymous/Snap/SnapModule.kt`)
- Added `@ReactMethod checkAccessibilityPermission(promise)`:
  - Queries `Settings.Secure.getInt` to ensure accessibility is turned on globally.
  - Queries `Settings.Secure.getString(ENABLED_ACCESSIBILITY_SERVICES)` to extract the raw colon-separated list of enabled services.
  - Checks if our exact `packageName/SnapAccessibilityService` is active in that string registry.
  - Safely resolves a `true` or `false` boolean back to the JS thread.
- Added `@ReactMethod openAccessibilitySettings()`:
  - Dispatches an explicit `Intent(android.provider.Settings.ACTION_ACCESSIBILITY_SETTINGS)`.
  - Appends `FLAG_ACTIVITY_NEW_TASK` to guarantee safe jumping outside the app context.

### 2. React Native Dashboard Updates (`app/home.tsx`)
- Imported `NativeModules.SnapModule` interface.
- Established `hasPermission` state.
- Attached `useFocusEffect` to continuously poll `SnapModule.checkAccessibilityPermission()` every time the user navigates back to the Home Screen (so it auto-refreshes when they return from Settings).
- Implemented the "Critical Permission Required" UI banner. Styled with `bg-[#1C1C1E]` and red warnings.
- Attached the `handleEnablePermission` deep-link function to the banner button.
- Conditioned the header pill: when true, it shows `Shield Active` (Green). When false, it shows `Shield Offline` (Red).

## Verification Status
- Lint & TypeScript passed with zero errors.
- Awaits human verification via `npx expo run:android` to test the native OS Settings Intent execution.
