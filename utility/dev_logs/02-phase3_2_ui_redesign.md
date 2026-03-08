# Dev Log: Phase 3.2 UI Redesign

## Goal
Completely redesign the application's UI based on reference inspiration images to match a brutalist, high-contrast, edge-to-edge aesthetic.

## Changes Made

### 1. Refactored Auth Screen (`app/index.tsx`)
- Changed the background to pure black (`bg-black`).
- Replaced the full-screen layout with a centered `bg-[#1C1C1E]` card with zero-radius inputs and sharp edges.
- Implemented "Snap Auth" header matching the inspiration.
- Updated the primary "LOGIN" button to use `bg-[#0A7AFF]` (Snap Pro Blue).
- Added the "DEVELOPER BYPASS" footer with distinct links (`Go to Home`, `Go to Paywall`, `Trigger Panic Overlay`) explicitly mirroring the inspiration image.

### 2. Refactored Home Dashboard (`app/home.tsx`)
- Built the top header explicitly with the blue square, the "SNAP" title, and the "SHIELD ACTIVE" green pill with `bg-green-950/30` styling.
- Remodeled the streak counter to center perfectly with `text-[120px]` sizing.
- Adjusted the manual trigger `PANIC` button to be a giant red circle (`bg-[#E53935]`) with a secondary border (`border-[#8e1d1b]`) and dropshadow.
- Updated the footer to be a dual-button setup: "GET PRO" (outlined) and "SIGN OUT" (grey fill).

### 3. Created Paywall Screen (`app/paywall.tsx`)
- Built an entirely new screen containing the dark rounded card layout.
- Added a `top-0` absolute blue line (`bg-[#0A7AFF]`) across the top of the card.
- Inserted the circular shield icon, title ("Snap Pro"), and subtitle.
- Designed the vertical feature list ("Zero-Willpower Watchdog", "Immutable Panic Room", "Permanent Data Wiping") prefixed by blue checkboxes.
- Included the `No RevenueCat offerings configured` warning text in red.
- Created the "I'LL RELY ON WILLPOWER FOR NOW" text fallback button below the card.

### 4. Fixed NativeWind CSS Loading
- The UI rewrite initially did not apply because the `tailwind.config.js` file's `content` array had been lost, so it wasn't scanning `app/` and `components/`.
- Restored `content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"]`.
- Modified `global.css` back to `@tailwind base; @tailwind components; @tailwind utilities;` syntax to successfully pass Expo and CLI tailwind bundling without errors.
