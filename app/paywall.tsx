import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaywallScreen() {
    const router = useRouter();
    const [currentPackage, setCurrentPackage] = useState<PurchasesPackage | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPurchasing, setIsPurchasing] = useState(false);

    useEffect(() => {
        fetchOfferings();
    }, []);

    async function fetchOfferings() {
        try {
            const offerings = await Purchases.getOfferings();
            if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                // Select the first available package in the current offering
                setCurrentPackage(offerings.current.availablePackages[0]);
            }
        } catch (e: any) {
            console.warn('Error fetching offerings:', e);
        } finally {
            setIsLoading(false);
        }
    }

    async function handlePurchase() {
        if (!currentPackage) return;
        setIsPurchasing(true);
        try {
            const { customerInfo } = await Purchases.purchasePackage(currentPackage);
            if (typeof customerInfo.entitlements.active['pro'] !== 'undefined') {
                Alert.alert('System Upgraded', 'Welcome to Snap Pro. Your shield is permanent.');
                router.back();
            }
        } catch (e: any) {
            if (!e.userCancelled) {
                Alert.alert('Transaction Failed', e.message);
            }
        } finally {
            setIsPurchasing(false);
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-black justify-center items-center px-6">
            <View className="w-full bg-[#1C1C1E] rounded-2xl relative overflow-hidden border border-zinc-800/50">
                {/* Top Blue Accent Line */}
                <View className="absolute top-0 left-6 right-6 h-1 bg-[#0A7AFF] rounded-b-md" />

                <View className="p-8 items-center mt-4">
                    {/* Logo in Circle */}
                    <View className="w-20 h-20 rounded-2xl border border-zinc-800 items-center justify-center mb-6 overflow-hidden">
                        <Image source={require('../assets/images/icon.png')} style={{ width: 80, height: 80 }} resizeMode="contain" />
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

                    {/* Dynamic Action Button */}
                    {isLoading ? (
                        <View className="h-14 mb-6 justify-center">
                            <ActivityIndicator color="#0A7AFF" />
                        </View>
                    ) : currentPackage ? (
                        <TouchableOpacity
                            className={`w-full h-14 bg-[#0A7AFF] rounded-lg flex items-center justify-center mb-6 active:scale-95 ${isPurchasing ? 'opacity-50' : ''}`}
                            onPress={handlePurchase}
                            disabled={isPurchasing}
                        >
                            {isPurchasing ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white font-bold text-sm tracking-widest uppercase">
                                    UPGRADE FOR {currentPackage.product.priceString}
                                </Text>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <View className="mb-6 p-4 rounded-lg bg-red-950/30 border border-red-900/50">
                            <Text className="text-red-500 text-xs font-bold text-center uppercase tracking-widest mb-1">
                                System Offline
                            </Text>
                            <Text className="text-red-400/80 text-[10px] text-center uppercase">
                                No Packages Found in Dashboard
                            </Text>
                        </View>
                    )}

                    <TouchableOpacity
                        className="active:opacity-70"
                        onPress={() => router.back()}
                    >
                        <Text className="text-zinc-500 font-bold text-xs uppercase tracking-widest">
                            I&apos;LL RELY ON WILLPOWER FOR NOW
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
