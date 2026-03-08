# Dev Log: Phase 3.2 Ironclad Lock & Cognitive Puzzle

## Goal
Force the app to launch on top of all other processes when the "danger" keyword is detected via the Android Accessibility Service. Implement a 60-second timer and a cognitive 2x2 grid puzzle that requires tapping numbers 1 to 4 sequentially to unlock the app and resume navigation.

## Changes Made

### 1. The Native Auto-Launch (Kotlin Watchdog)
- **File**: `android/app/src/main/java/com/anonymous/Snap/SnapAccessibilityService.kt`
- Created an explicit intent payload targeting the Android `packageManager.getLaunchIntentForPackage(packageName)`.
- Re-routed the app directly to the foreground by attaching the intent flags `Intent.FLAG_ACTIVITY_NEW_TASK` and `Intent.FLAG_ACTIVITY_REORDER_TO_FRONT`.
- The moment "danger" is typed/parsed on screen, it simultaneously shoots the JS event emitter *and* executes `startActivity(intent)` to physically drag the user into the `PanicOverlay.tsx`.

### 2. The 60-Second Timer (`components/PanicOverlay.tsx`)
- Established a `setInterval` hook countdown decrementing `timeLeft` every second.
- Styled a massive `text-[120px]` gold yellow timer centered on an electric blue background (`bg-[#0047AB]`).
- Appended the "DROP AND DO SQUATS" military/brutalist instruction to the countdown.
- Fixed Android and iOS BackHandler interception to permanently swallow back gestures as long as `isLocked` is true.

### 3. The 1-to-4 Sequence Puzzle (`components/PanicOverlay.tsx`)
- Implemented a completely randomized but deterministic 2x2 grid representing nodes 1, 2, 3, and 4.
- Handled the state logic using `expectedNode` (starting at 1).
- Correct taps (`nodeValue === expectedNode`) increment the state.
- Incorrect taps instantaneously reset progress back to 1 (punitive restart).
- Upon completing sequence 4, unlocking triggers correctly: 
  - `setIsLocked(false)`
  - `setTimeLeft(60)`
  - `setExpectedNode(1)` 

### 4. Compilation Fixes
- Addressed `java.lang.String cannot be cast to java.lang.Double` fatal error thrown by `tracking-[0.2em]`. The React Native parser expects a numeric spacing output from Tailwind. Replaced it manually across implementations with the unified `tracking-widest` tailwind utility class.
- Fixed strict typescript error for NodeJS types by upgrading `interval` to cast `ReturnType<typeof setInterval>`.
- Resolved an ESLint string escape rule for a single `'` unescaped quote on the paywall layout.
