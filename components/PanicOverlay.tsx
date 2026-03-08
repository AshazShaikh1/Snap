import React, { useEffect, useState } from 'react';
import { BackHandler, DeviceEventEmitter, Text, TouchableOpacity, View } from 'react-native';

export function PanicOverlay() {
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('onBlockTriggered', () => {
            setIsLocked(true);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        const handleBackPress = () => {
            if (isLocked) {
                return true; // Swallow the back press
            }
            return false; // Let default behavior happen
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            backHandler.remove();
        };
    }, [isLocked]);

    if (!isLocked) return null;

    return (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-blue-600 z-50 elevation-50 items-center justify-center p-6">
            <Text className="text-white font-display text-5xl mb-12 text-center" style={{ textShadowColor: 'black', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 1 }}>
                BREACH DETECTED
            </Text>

            <Text className="text-white text-center font-sans mb-12">
                The Panic Room is active. Complete a physical task to unlock.
            </Text>

            <TouchableOpacity
                className="border-2 border-white px-8 py-4 items-center"
                onPress={() => setIsLocked(false)}
            >
                <Text className="text-white font-bold text-lg">UNLOCK (TEST)</Text>
            </TouchableOpacity>
        </View>
    );
}
