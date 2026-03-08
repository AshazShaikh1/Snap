import { Stack } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PanicOverlay } from '../components/PanicOverlay';
import { TerminalToast } from '../components/TerminalToast';
import '../global.css';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <View style={{ flex: 1, backgroundColor: '#000' }}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="home" />
                    <Stack.Screen name="paywall" />
                </Stack>
                <TerminalToast />
                <PanicOverlay />
            </View>
        </SafeAreaProvider>
    );
}
