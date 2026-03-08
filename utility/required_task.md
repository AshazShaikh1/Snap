# Required Task: RevenueCat Dashboard Setup

To make the Paywall fully functional and actually charge users, you must complete these steps in your RevenueCat and App Store/Google Play dashboards:

## Step 1: Create the Subscriptions (Google/Apple)
You have to create the actual subscription products in the app stores first:
1. Go to the **Google Play Console** (and/or App Store Connect).
2. Navigate to Monetization -> Subscriptions.
3. Create a new subscription (e.g., ID: `snap_pro_monthly`).
4. Set the price and make it active.

## Step 2: Link to RevenueCat
RevenueCat needs to know about the products you just made:
1. Go to your **RevenueCat Dashboard**.
2. Click on **Products** in the left menu.
3. Add the exact same Product ID (`snap_pro_monthly`) that you created in Google Play/App Store.

## Step 3: Create an Entitlement
Entitlements are what you actually check for in the code to see if they have Pro access (this app checks for the `"pro"` entitlement):
1. In RevenueCat, click **Entitlements**.
2. Create a new one named `pro`.
3. Attach the Product you made in Step 2 to this `pro` Entitlement.

## Step 4: Create an Offering
Offerings are what the Paywall dynamically displays to the user:
1. In RevenueCat, click **Offerings**.
2. Create a new Offering (usually set as `default`).
3. Add a Package to this offering, and attach your Product to it.

Once you have done those 4 steps, the Live Paywall code in `app/paywall.tsx` will automatically fetch the package and display the real price!
