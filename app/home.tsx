import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { DeviceEventEmitter, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import { supabase } from '../utils/supabase';

export default function HomeScreen() {
    const router = useRouter();
    const [streak, setStreak] = useState<number>(0);

    useEffect(() => {
        fetchStreak();
    }, []);

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

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.replace('/');
    }

    function handleManualPanic() {
        DeviceEventEmitter.emit('onBlockTriggered');
    }

    function handleGetPro() {
        router.push('/paywall');
    }

    return (
        <SafeAreaView className="flex-1 bg-black">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-6 border-b border-zinc-900">
                <View className="flex-row items-center">
                    <View className="w-5 h-5 bg-[#007AFF] rounded-sm mr-3" />
                    <Text className="text-white font-black text-xl tracking-wider">SNAP</Text>
                </View>
                <View className="px-3 py-1.5 rounded-full border border-green-800 bg-green-950/30">
                    <Text className="text-green-500 text-[10px] font-bold tracking-widest uppercase">
                        Shield Active
                    </Text>
                </View>
            </View>

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
        </SafeAreaView>
    );
}
