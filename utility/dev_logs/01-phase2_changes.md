# Project Changes Log

## Start of Phase 2

### Prompt 1: EXECUTE PHASE 2: Core Functionality (Plumbing & Native Bridge)

**1. Rebuilt the Auth Screen (`app/index.tsx`)**
Wired the screen to Supabase authentication (`signInWithPassword` and `signUp`). Added React state for email and password inputs.

```tsx
// app/index.tsx (snippet)
async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Login Failed', error.message);
    else router.replace('/home');
}
```

**2. Built the Home Dashboard (`app/home.tsx`)**
Added logic to fetch the user's `last_relapse_date` from the `profiles` table to calculate their current streak in days. Also added a "Manual Panic Test" button to trigger the native event emitter, and a sign out button.

```tsx
// app/home.tsx (snippet)
async function fetchStreak() {
    // ... fetches user
    const { data } = await supabase.from('profiles').select('last_relapse_date').eq('id', user.id).single();
    const lastRelapse = new Date(data.last_relapse_date).getTime();
    const days = Math.floor((Date.now() - lastRelapse) / (1000 * 60 * 60 * 24));
    setStreak(days);
}

function handleManualPanic() {
    DeviceEventEmitter.emit('onBlockTriggered');
}
```

**3. Created the Panic Overlay (`components/PanicOverlay.tsx`)**
Built an absolute positioned view that listens for the `onBlockTriggered` event from the Android native side and renders over the entire screen when triggered.

```tsx
// components/PanicOverlay.tsx (snippet)
useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('onBlockTriggered', () => {
        setIsLocked(true);
    });
    return () => subscription.remove();
}, []);
```

**4. Injected Panic Overlay into Root Layout (`app/_layout.tsx`)**
Modified the root layout to mount `<PanicOverlay />` outside of the navigation stack.

```tsx
// app/_layout.tsx (snippet)
return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Stack screenOptions={{ headerShown: false }} />
        <PanicOverlay />
    </View>
);
```

**5. Set up Android Accessibility Service (Native Android Bridge)**
- Created `android/app/src/main/res/xml/accessibility_service_config.xml` mapping the configuration.
- Created `SnapAccessibilityService.kt` to monitor screen content and detect the word "danger".
- Created `SnapModule.kt` to securely emit the `onBlockTriggered` event to the React Native JS thread via `RCTDeviceEventEmitter`.
- Created `SnapPackage.kt` to bundle the native module for React Native.
- Modified `android/app/src/main/AndroidManifest.xml` to declare the Android `<service>` and ask for `BIND_ACCESSIBILITY_SERVICE` permissions.
- Modified `android/app/src/main/java/com/anonymous/Snap/MainApplication.kt` to register `SnapPackage()` in the `getPackages()` list.

---

### Prompt 2: Fix `BackHandler.removeEventListener` TypeScript error in `PanicOverlay.tsx`

**1. Fixed React Native hardware back press cleanup**
The previous implementation tried to call `removeEventListener` on `BackHandler` which is deprecated/removed in modern React Native. Updated it to call `.remove()` on the returned reference.

```tsx
// components/PanicOverlay.tsx (snippet)
useEffect(() => {
    const handleBackPress = () => isLocked ? true : false;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    
    return () => {
        backHandler.remove();
    };
}, [isLocked]);
```

---

### Prompt 3: Give the SQL commands for the database and RLS policies

**1. Created `SQL/01-create-profiles-and-rls.sql`**
Created the database schema for the Supabase project to support standard and hardcore tracking modes, streak calculations, and RLS (Row Level Security) safety.

```sql
-- SQL/01-create-profiles-and-rls.sql (snippet)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  last_relapse_date TIMESTAMPTZ DEFAULT now(),
  subscription_status TEXT DEFAULT 'free',
  settings_mode TEXT DEFAULT 'standard',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Auto-generator for new signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger as $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (new.id, new.email);
  RETURN new;
END;
$$ language plpgsql security definer;
```

---

### Prompt 4: Unable to resolve "@react-native-async-storage/async-storage"

**1. Installed missing Async Storage package**
The user's environment threw a bundling error because Supabase required `@react-native-async-storage/async-storage` as a dependency but it was not present.

Ran terminal command:
```bash
npx expo install @react-native-async-storage/async-storage
```

---

### Prompt 5: Blank white screen rendering issue

**1. Added `babel.config.js` for NativeWind v4 rendering**
Nativewind requires a specific babel configuration in Expo SDK 50+ to process its `className` attributes otherwise views compile with 0 height.

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

**2. Updated layout root view to explicit flex styling (`app/_layout.tsx`)**
To guarantee that the root wrapper view always spans the screen height and acts as an anchor for NativeWind children.

```tsx
// app/_layout.tsx (snippet)
// Changed from <View className="flex-1"> to inline styling
<View style={{ flex: 1, backgroundColor: '#000' }}>
```
