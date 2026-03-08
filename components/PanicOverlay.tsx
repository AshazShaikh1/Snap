import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { BackHandler, DeviceEventEmitter, Text, TouchableOpacity, View } from 'react-native';

const PUZZLE_NODES = [3, 1, 4, 2];

export function PanicOverlay() {
    const [isLocked, setIsLocked] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [expectedNode, setExpectedNode] = useState(1);

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('onBlockTriggered', () => {
            setIsLocked(true);
            setTimeLeft(60);
            setExpectedNode(1);
        });

        return () => subscription.remove();
    }, []);

    useEffect(() => {
        const handleBackPress = () => isLocked; // Always return true if locked to block back press
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => backHandler.remove();
    }, [isLocked]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isLocked && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isLocked, timeLeft]);

    function handlePuzzleTap(nodeValue: number) {
        if (nodeValue === expectedNode) {
            if (expectedNode === 4) {
                // Puzzle completed successfully
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                setIsLocked(false);
                setTimeLeft(60);
                setExpectedNode(1);
            } else {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setExpectedNode(expectedNode + 1);
            }
        } else {
            // Punish wrong tap
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            setExpectedNode(1);
        }
    }

    if (!isLocked) return null;

    if (timeLeft > 0) {
        return (
            <View className="absolute top-0 left-0 right-0 bottom-0 bg-[#0047AB] z-50 items-center justify-center p-6">
                <Text className="text-white font-black text-4xl mb-8 tracking-widest text-center">
                    BREACH DETECTED
                </Text>

                <Text className="text-[#FFD700] font-black text-[120px] leading-none mb-12">
                    {timeLeft}
                </Text>

                <Text className="text-white text-center font-bold text-2xl tracking-widest uppercase">
                    DROP AND DO SQUATS
                </Text>
            </View>
        );
    }

    // Puzzle UI Active
    return (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black z-50 items-center justify-center p-6">
            <Text className="text-red-500 font-bold text-lg mb-12 text-center tracking-widest border border-red-900 bg-red-950/30 p-4">
                SYSTEM REBOOT:{'\n'}TAP 1 TO 4 IN SEQUENCE
            </Text>

            <View className="flex-row flex-wrap justify-center w-64 gap-y-4">
                {PUZZLE_NODES.map((nodeValue) => (
                    <TouchableOpacity
                        key={nodeValue}
                        onPress={() => handlePuzzleTap(nodeValue)}
                        className="w-24 h-24 bg-zinc-900 border-4 border-zinc-700 items-center justify-center m-2 active:bg-zinc-700"
                    >
                        <Text className="text-white text-4xl font-black">
                            {nodeValue}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View className="mt-16 items-center">
                <Text className="text-zinc-500 font-mono text-sm tracking-widest uppercase mb-2">
                    SEQUENCE PROGRESS
                </Text>
                <View className="flex-row space-x-2">
                    {[1, 2, 3, 4].map(num => (
                        <View
                            key={num}
                            className={`w-3 h-3 rounded-full ${num < expectedNode ? 'bg-green-500' : 'bg-zinc-800'}`}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}
