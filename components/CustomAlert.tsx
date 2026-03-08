import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    onCancel: () => void;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    isDestructive?: boolean;
}

export function CustomAlert({
    visible,
    title,
    message,
    onCancel,
    onConfirm,
    confirmText = 'EXECUTE',
    cancelText = 'ABORT',
    isDestructive = true
}: CustomAlertProps) {
    if (!visible) return null;

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View className="flex-1 bg-black/80 items-center justify-center px-6">
                <View className="w-full bg-[#1C1C1E] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">

                    {/* Header */}
                    <View className={`px-6 py-4 border-b border-zinc-800 ${isDestructive ? 'bg-red-950/20' : 'bg-zinc-900/50'}`}>
                        <Text className={`font-black text-lg tracking-widest uppercase ${isDestructive ? 'text-red-500' : 'text-white'}`}>
                            {title}
                        </Text>
                    </View>

                    {/* Body */}
                    <View className="p-6">
                        <Text className="text-zinc-400 text-sm leading-relaxed">
                            {message}
                        </Text>
                    </View>

                    {/* Footer Actions */}
                    <View className="flex-row border-t border-zinc-800">
                        <TouchableOpacity
                            onPress={onCancel}
                            className="flex-1 py-4 items-center justify-center border-r border-zinc-800 active:bg-zinc-800"
                        >
                            <Text className="text-zinc-500 font-bold text-xs tracking-widest uppercase">
                                {cancelText}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            className={`flex-1 py-4 items-center justify-center active:bg-zinc-800 ${isDestructive ? 'bg-red-950/30' : 'bg-[#0A7AFF]/10'}`}
                        >
                            <Text className={`font-bold text-xs tracking-widest uppercase ${isDestructive ? 'text-red-500' : 'text-[#0A7AFF]'}`}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
