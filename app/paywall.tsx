import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export default function PaywallScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-black justify-center items-center px-6">
            <View className="w-full bg-[#1C1C1E] rounded-2xl relative overflow-hidden border border-zinc-800/50">
                {/* Top Blue Accent Line */}
                <View className="absolute top-0 left-6 right-6 h-1 bg-[#0A7AFF] rounded-b-md" />

                <View className="p-8 items-center mt-4">
                    {/* Shield Icon in Circle */}
                    <View className="w-16 h-16 rounded-full border-2 border-[#0A7AFF] items-center justify-center mb-6 bg-black/20">
                        <MaterialIcons name="security" size={28} color="#8dbffc" />
                    </View>

                    <Text className="text-white font-bold text-3xl mb-4 tracking-tight">
                        Snap Pro
                    </Text>

                    <Text className="text-zinc-400 text-center text-sm leading-relaxed px-4 mb-8">
                        Unlock the ultimate deterministic defense. Never rely on willpower alone again.
                    </Text>

                    {/* Feature List */}
                    <View className="w-full px-2 mb-8 space-y-4 flex-col gap-4">
                        <View className="flex-row items-center">
                            <MaterialIcons name="check" size={20} color="#0A7AFF" />
                            <Text className="text-white ml-3 font-medium text-[15px]">Zero-Willpower Watchdog</Text>
                        </View>
                        <View className="flex-row items-center">
                            <MaterialIcons name="check" size={20} color="#0A7AFF" />
                            <Text className="text-white ml-3 font-medium text-[15px]">Immutable Panic Room</Text>
                        </View>
                        <View className="flex-row items-center">
                            <MaterialIcons name="check" size={20} color="#0A7AFF" />
                            <Text className="text-white ml-3 font-medium text-[15px]">Permanent Data Wiping</Text>
                        </View>
                    </View>

                    <Text className="text-red-500 text-xs font-medium text-center mb-8 px-4">
                        No RevenueCat offerings configured for this environment!
                    </Text>

                    <TouchableOpacity
                        className="active:opacity-70"
                        onPress={() => router.back()}
                    >
                        <Text className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
                            I'LL RELY ON WILLPOWER FOR NOW
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
