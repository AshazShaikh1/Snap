import { Stack } from 'expo-router';
import { View } from 'react-native';
import { PanicOverlay } from '../components/PanicOverlay';
import '../global.css';

export default function RootLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="home" />
            </Stack>
            <PanicOverlay />
        </View>
    );
}
