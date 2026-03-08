import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    DeviceEventEmitter,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
// @ts-ignore
import { supabase } from '../utils/supabase';

export default function AuthScreen() {
    const router = useRouter();

    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.replace('/home');
            } else {
                setIsCheckingAuth(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                router.replace('/home');
            } else {
                setIsCheckingAuth(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    async function handleAuth() {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

        if (!email || !password || (isSignUp && !displayName)) {
            DeviceEventEmitter.emit('showToast', { type: 'error', message: 'Please fill all required fields.' });
            return;
        }

        setIsLoading(true);
        Keyboard.dismiss();

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            display_name: displayName,
                        },
                    },
                });
                if (error) throw error;
                DeviceEventEmitter.emit('showToast', { type: 'success', message: 'SESSION AUTHENTICATED' });
                router.replace('/home');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                DeviceEventEmitter.emit('showToast', { type: 'success', message: 'SESSION AUTHENTICATED' });
                router.replace('/home');
            }
        } catch (err: any) {
            DeviceEventEmitter.emit('showToast', { type: 'error', message: err.message });
        } finally {
            setIsLoading(false);
        }
    }

    if (isCheckingAuth) {
        return (
            <View className="flex-1 bg-black justify-center items-center">
                <Text className="text-white font-mono tracking-widest text-sm">[ SYSTEM INITIALIZING ]</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-black"
        >


            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 40 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="bg-[#1C1C1E] rounded-2xl p-6 mb-8 w-full border border-zinc-900 shadow-lg mt-14">
                        <View className="items-center mb-6">
                            <Image
                                source={require('../assets/images/icon.png')}
                                style={{ width: 64, height: 64, borderRadius: 16 }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text className="text-2xl font-bold text-white text-center mb-2 tracking-tight">
                            Snap Auth
                        </Text>

                        {isSignUp && (
                            <TextInput
                                className="w-full h-14 bg-black border border-zinc-800 rounded-lg text-white px-4 mb-4"
                                placeholder="Display Name"
                                placeholderTextColor="#666"
                                value={displayName}
                                onChangeText={setDisplayName}
                                autoCapitalize="words"
                                editable={!isLoading}
                            />
                        )}

                        <TextInput
                            className="w-full h-14 bg-black border border-zinc-800 rounded-lg text-white px-4 mb-4"
                            placeholder="Email"
                            placeholderTextColor="#666"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            editable={!isLoading}
                        />

                        <View className="w-full h-14 mb-6 relative justify-center">
                            <TextInput
                                className="w-full h-full bg-black border border-zinc-800 rounded-lg text-white px-4 pr-12"
                                placeholder="Password"
                                placeholderTextColor="#666"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                className="absolute right-4"
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color="#666" />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            className={`w-full h-14 bg-[#0A7AFF] rounded-lg flex items-center justify-center mb-4 active:scale-95 ${isLoading ? 'opacity-50' : ''}`}
                            onPress={handleAuth}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Text className="text-white font-mono tracking-widest text-sm">[ PROCESSING ]</Text>
                            ) : (
                                <Text className="text-white font-bold text-base tracking-wide">
                                    {isSignUp ? 'REGISTER' : 'LOGIN'}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-full h-14 bg-[#121212] border border-zinc-800 rounded-lg flex items-center justify-center active:scale-95"
                            onPress={() => {
                                setIsSignUp(!isSignUp);
                            }}
                            disabled={isLoading}
                        >
                            <Text className="text-zinc-400 font-bold text-sm tracking-wide">
                                {isSignUp ? 'RETURN TO LOGIN' : 'CREATE ACCOUNT'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
