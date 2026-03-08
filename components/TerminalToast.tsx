import React, { useEffect, useState } from 'react';
import { DeviceEventEmitter, Text, View } from 'react-native';

export function TerminalToast() {
    const [toast, setToast] = useState<{ type: 'error' | 'success', message: string } | null>(null);

    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener('showToast', ({ type, message }) => {
            setToast({ type, message });
            setTimeout(() => {
                setToast(null);
            }, 3000);
        });

        return () => subscription.remove();
    }, []);

    if (!toast) return null;

    const isSuccess = toast.type === 'success';

    return (
        <View className="absolute top-12 left-4 right-4 z-50 p-4 border border-zinc-800 bg-black flex-row items-center shadow-2xl">
            <View className={`w-2 h-2 rounded-full mr-3 ${isSuccess ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
            <Text className={`font-mono text-xs tracking-widest uppercase ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
                {isSuccess ? `[ OK ] ${toast.message}` : `[ ERR ] ${toast.message}`}
            </Text>
        </View>
    );
}
