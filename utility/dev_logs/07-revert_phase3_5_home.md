# Dev Log: Revert Phase 3.5 The Command Center (Home Screen)

## Goal
The user decided that the dense, rigid "Military/Terminal Command Center" aesthetic from Phase 3.5 did not fit their vision. They requested a rollback to the simpler, prototyping aesthetic we had established in Phase 3.2.

## Changes Made

### 1. `app/home.tsx` Layout Reversion
- **Header**: Restored the standard `flex-row` alignment and padded spacing for the "SNAP" logo and active status pill.
- **Core Streak Display**: Ripped out the dark background hardware panel border, returning the massive `text-[120px]` streak digits to float freely in the center of the black void.
- **Removed Grid**: Deleted the 2-column metrics display (Protocol & Subscription). 
- **Footer Buttons**: Restored the `flex-row space-x-4` layout featuring two large, rounded rectangular buttons for "GET PRO" and "SIGN OUT" (`h-14 bg-[#1C1C1E] rounded-lg`).
- **Panic Button**: Destroyed the absolute-bottom edge-to-edge kill switch. Restored the massive `h-48 w-48` circular red button with the heavy `border-[12px]` into the center column beneath the streak counter.

### 2. Safely Retained Logic
- Did **NOT** revert the native Android Accessibility Permission bridging (`checkAccessibilityPermission`). The React `useFocusEffect` layout handling remains active.
- Did **NOT** revert the `react-native-safe-area-context` library implementation out of `app/_layout.tsx`. The status-bar overlap padding fix remains structurally locked.

## Verification Status
- Lint & TypeScript re-checked and passed cleanly.
- Live Expo app immediately hot-reloads into the cleaner layout.
