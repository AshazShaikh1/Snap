# Architecture Decisions
- **Streak:** "Option A" (Store `last_relapse_date` only). Client calculates days.
- **Entitlements:** RevenueCat entitlement ID is `snap_pro_access`.
- **Expo:** Using Expo Prebuild. We must use Config Plugins or manual Android folder edits for the Accessibility Service.
- **Permissions:** Android requires user to manually grant "Display over other apps" and "Accessibility". UI must guide them there.