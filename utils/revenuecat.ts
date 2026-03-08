import { Platform } from 'react-native';
// @ts-ignore
import Purchases from 'react-native-purchases';

const apiKey = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY || '';

export const initRevenueCat = () => {
    if (Platform.OS === 'android' && apiKey) {
        Purchases.configure({ apiKey });
    }
};
