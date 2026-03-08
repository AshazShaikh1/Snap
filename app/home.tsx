import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { DeviceEventEmitter, Text, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import { supabase } from '../utils/supabase';

export default function HomeScreen() {
    const router = useRouter();
    const [streak, setStreak] = useState<number | null>(null);

    useEffect(() => {
        fetchStreak();
    }, []);

    async function fetchStreak() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.replace('/');
            return;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('last_relapse_date')
            .eq('id', user.id)
            .single();

        if (error || !data?.last_relapse_date) {
            setStreak(0);
            // Wait, let's create a stub profile if missing, actually just set 0 for MVP
        } else {
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

    return (
        <View className="bg-black flex-1 items-center justify-center p-6">
            <Text className="text-white font-display text-xl mb-4 text-center">
                SNAP // DASHBOARD
            </Text>

            <View className="items-center mb-12">
                <Text className="text-zinc-500 font-sans mb-2">CURRENT STREAK</Text>
                <Text className="text-white font-display text-8xl">
                    {streak !== null ? streak : '--'}
                </Text>
                <Text className="text-zinc-500 font-sans mt-2">DAYS</Text>
            </View>

            <TouchableOpacity
                className="w-full bg-red-600 p-6 mb-8 items-center border-4 border-red-900"
                onPress={handleManualPanic}
            >
                <Text className="text-white font-bold text-xl">MANUAL PANIC TEST</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="w-full bg-transparent border border-zinc-700 p-4 items-center absolute bottom-10"
                onPress={handleSignOut}
            >
                <Text className="text-zinc-500 font-bold">SIGN OUT</Text>
            </TouchableOpacity>
        </View>
    );
}
