# Dev Log: Phase 3.4 Auth Revamp & Custom Toasts

## Goal
Remove the developer bypass UI on the Auth screen, implement a new 'Display Name' input during sign up (updating the database profile), add a password visibility toggle, and replace the generic OS defaults with a custom Brutalist Toast notification UI for errors and successes.

## Changes Made

### 1. Expanded `app/index.tsx` Core Layout
- Added `isSignUp` boolean state to toggle between Login functionality and Registration functionality dynamically within the same card.
- Replaced the two horizontal buttons with a primary context-aware Action Button (blue) and a secondary Text Switch Button (dark grey).
- Added `showPassword` state and an eye icon (`MaterialIcons` visibility toggle) inside a relative `View` overlaying the password input.
- Stripped the Developer Bypass section completely out of the bottom of the `ScrollView`.

### 2. Custom Toast System
- Designed a custom absolute-positioned `View` banner mapped to `toastType` and `toastMessage` states.
- Replaced every instance of `Alert.alert` with `showToast(message, type)`.
- Replicates the brutalist aesthetic:
  - Error: Deep Crimson (`bg-[#8B0000]`) with border and X icon.
  - Success: Dark Green (`bg-green-900`) with checkmark icon.
- Features an exact 3.5-second timeout hook before unmounting.

### 3. Display Name Metadata & SQL Profile Update
- If `isSignUp` is toggled true, the Auth screen injects an extra conditionally rendered `TextInput` for the Display Name.
- Appended `options: { data: { display_name: displayName } }` into the `supabase.auth.signUp()` payload.
- Created `utility/SQL/02-add-display-name-to-profiles.sql` script to physically expand the Postgres schema. The SQL script:
  - Alters `public.profiles` to inject `display_name TEXT`.
  - Replaces the `handle_new_user()` Postgres trigger to extract `new.raw_user_meta_data->>'display_name'` immediately upon Auth creation instead of just syncing the email.

## Verification Status
- Lint & TypeScript passed with zero errors.
- **Pending Human Verification**: Expected user execution of `utility/SQL/02-add-display-name-to-profiles.sql` inside the Supabase SQL editor is required for the new variable to persist properly into `profiles`.
