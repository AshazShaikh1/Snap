import * as Haptics from 'expo-haptics';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { DeviceEventEmitter, Image, NativeModules, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomAlert } from '../components/CustomAlert';
// @ts-ignore
import { supabase } from '../utils/supabase';

const { SnapModule } = NativeModules;

export default function HomeScreen() {
    const router = useRouter();
    const [streak, setStreak] = useState<number>(0);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useFocusEffect(
        React.useCallback(() => {
            fetchStreak();
            checkPermission();
        }, [])
    );

    async function checkPermission() {
        if (!SnapModule?.checkAccessibilityPermission) return;
        try {
            const isEnabled = await SnapModule.checkAccessibilityPermission();
            setHasPermission(isEnabled);
        } catch (e) {
            console.warn('Failed to check accessibility permission', e);
            setHasPermission(false);
        }
    }

    async function fetchStreak() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // Silent return for bypass purposes

        const { data, error } = await supabase
            .from('profiles')
            .select('last_relapse_date')
            .eq('id', user.id)
            .single();

        if (!error && data?.last_relapse_date) {
            const lastRelapse = new Date(data.last_relapse_date).getTime();
            const now = Date.now();
            const days = Math.floor((now - lastRelapse) / (1000 * 60 * 60 * 24));
            setStreak(days);
        }
    }

    const [alertConfig, setAlertConfig] = useState<{
        visible: boolean;
        title: string;
        message: string;
        confirmText: string;
        onConfirm: () => void;
    }>({
        visible: false,
        title: '',
        message: '',
        confirmText: '',
        onConfirm: () => { }
    });

    const closeAlert = () => setAlertConfig(prev => ({ ...prev, visible: false }));

    function handleSignOut() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setAlertConfig({
            visible: true,
            title: 'TERMINATE SESSION?',
            message: 'Are you sure you want to disconnect your operative profile?',
            confirmText: 'DISCONNECT',
            onConfirm: async () => {
                closeAlert();
                await supabase.auth.signOut();
                DeviceEventEmitter.emit('showToast', { type: 'success', message: 'SYSTEM DISCONNECTED' });
                router.replace('/');
            }
        });
    }

    function handleManualPanic() {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        setAlertConfig({
            visible: true,
            title: 'MANUAL OVERRIDE',
            message: 'This will lock the device for 60 seconds. Proceed?',
            confirmText: 'EXECUTE',
            onConfirm: () => {
                closeAlert();
                DeviceEventEmitter.emit('onBlockTriggered');
            }
        });
    }

    function handleGetPro() {
        router.push('/paywall');
    }

    function handleEnablePermission() {
        if (SnapModule?.openAccessibilitySettings) {
            SnapModule.openAccessibilitySettings();
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-6 border-b border-zinc-900">
                <View className="flex-row items-center">
                    <Image source={require('../assets/images/favicon.png')} style={{ width: 26, height: 26, borderRadius: 6 }} resizeMode="contain" />
                    <Text className="text-white font-black text-xl tracking-wider ml-3">SNAP</Text>
                </View>

                {hasPermission === true ? (
                    <View className="px-3 py-1.5 rounded-full border border-green-800 bg-green-950/30">
                        <Text className="text-green-500 text-[10px] font-bold tracking-widest uppercase">
                            Shield Active
                        </Text>
                    </View>
                ) : (
                    <View className="px-3 py-1.5 rounded-full border border-red-800 bg-red-950/30">
                        <Text className="text-red-500 text-[10px] font-bold tracking-widest uppercase">
                            Shield Offline
                        </Text>
                    </View>
                )}
            </View>

            {/* Permissions Warning Banner */}
            {hasPermission === false && (
                <View className="bg-[#1C1C1E] border border-red-900/50 m-4 p-4 rounded-xl items-center">
                    <Text className="text-red-500 font-bold tracking-widest text-xs mb-2 uppercase text-center">
                        Critical Permission Required
                    </Text>
                    <Text className="text-zinc-400 text-center text-xs mb-4">
                        Snap requires the Android Accessibility Service to detect relapse keywords in other apps.
                    </Text>
                    <TouchableOpacity
                        className="bg-red-900 border border-red-800 px-6 py-3 rounded-lg active:scale-95"
                        onPress={handleEnablePermission}
                    >
                        <Text className="text-white font-bold tracking-widest text-xs">
                            ENABLE NOW
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Main Content Area */}
            <View className="flex-1 items-center justify-center pb-20">
                <Text className="text-zinc-500 font-bold tracking-widest text-sm mb-4">
                    CURRENT STREAK
                </Text>

                <Text className="text-white font-bold text-[120px] leading-none mb-4 tracking-tighter">
                    {streak}
                </Text>

                <Text className="text-zinc-500 font-medium tracking-widest text-lg uppercase mb-20">
                    Days
                </Text>

                {/* Panic Button */}
                <TouchableOpacity
                    onPress={handleManualPanic}
                    className="w-48 h-48 rounded-full bg-[#E53935] border-[12px] border-[#8e1d1b] items-center justify-center active:scale-95 shadow-2xl shadow-red-900"
                    style={{ elevation: 15 }}
                >
                    <Text className="text-white font-black text-3xl tracking-wide mb-1">
                        PANIC
                    </Text>
                    <Text className="text-white/80 font-bold text-xs">
                        MANUAL TRIGGER
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="flex-row px-4 pb-8 space-x-4">
                <TouchableOpacity
                    onPress={handleGetPro}
                    className="flex-1 h-14 border border-zinc-700 rounded-lg items-center justify-center active:scale-95"
                >
                    <Text className="text-white font-bold text-xs tracking-wider">GET PRO</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleSignOut}
                    className="flex-1 h-14 bg-[#1C1C1E] rounded-lg items-center justify-center active:scale-95"
                >
                    <Text className="text-zinc-400 font-bold text-xs tracking-wider">SIGN OUT</Text>
                </TouchableOpacity>
            </View>
            {/* Custom Modal Overlays */}
            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                confirmText={alertConfig.confirmText}
                onConfirm={alertConfig.onConfirm}
                onCancel={closeAlert}
                isDestructive={true}
            />
        </SafeAreaView>
    );
}
