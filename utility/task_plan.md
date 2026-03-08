## Phase 1: Setup & Link
- [ ] Initialize Expo with NativeWind and Supabase.
- [ ] Create `supabase.ts` client and `revenuecat.ts` provider.
- [ ] **Critical:** Generate the Android Native Module for `AccessibilityService`. Update `AndroidManifest.xml` and create `SnapAccessibilityService.kt`.

## Phase 2: The Core (Native Bridge)
- [ ] Build the Kotlin "Watchdog" that reads screen content.
- [ ] Implement the `onBlockTriggered` event emitter to the JS thread.

## Phase 3: The UI (React Native - Brutalist Aesthetic)
- [ ] Build `AuthScreen` (Sharp edges, terminal vibe).
- [ ] Build `HomeScreen` (Massive streak numbers, industrial Panic Button at the bottom).
- [ ] Build `PanicOverlay` (Full-screen Electric Blue, un-closeable, 60s timer + puzzle).
- [ ] Build `PaywallScreen` (Vantablack, neon green terminal text for features).