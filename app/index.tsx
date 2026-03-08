import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    DeviceEventEmitter,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
// @ts-ignore
import { supabase } from '../utils/supabase';

export default function AuthScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin() {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password.');
            return;
        }
        setIsLoading(true);
        Keyboard.dismiss();
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            router.replace('/home');
        } catch (err: any) {
            Alert.alert('Login Failed', err.message);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSignUp() {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password.');
            return;
        }
        setIsLoading(true);
        Keyboard.dismiss();
        try {
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            router.replace('/home');
        } catch (err: any) {
            Alert.alert('Signup Failed', err.message);
        } finally {
            setIsLoading(false);
        }
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
                    {/* Main Auth Card */}
                    <View className="bg-[#1C1C1E] rounded-2xl p-6 mb-8 w-full border border-zinc-900 shadow-lg">
                        <Text className="text-2xl font-bold text-white text-center mb-6 tracking-tight">
                            Snap Auth
                        </Text>

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

                        <TextInput
                            className="w-full h-14 bg-black border border-zinc-800 rounded-lg text-white px-4 mb-6"
                            placeholder="Password"
                            placeholderTextColor="#666"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            editable={!isLoading}
                        />

                        <TouchableOpacity
                            className={`w-full h-14 bg-[#0A7AFF] rounded-lg flex items-center justify-center mb-4 active:scale-95 ${isLoading ? 'opacity-50' : ''}`}
                            onPress={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text className="text-white font-bold text-base tracking-wide">
                                    LOGIN
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-full h-14 bg-[#121212] border border-zinc-800 rounded-lg flex items-center justify-center active:scale-95"
                            onPress={handleSignUp}
                            disabled={isLoading}
                        >
                            <Text className="text-white font-bold text-base tracking-wide">
                                SIGN UP
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Developer Bypass Section */}
                    <View className="w-full items-center">
                        <View className="w-full h-[1px] bg-zinc-800 mb-6" />
                        <Text className="text-zinc-500 font-bold text-xs tracking-widest mb-4">
                            DEVELOPER BYPASS
                        </Text>

                        <TouchableOpacity
                            className="w-full h-14 bg-[#1C1C1E] border border-zinc-800 rounded-lg flex items-center justify-center mb-3 active:scale-95"
                            onPress={() => router.replace('/home')}
                        >
                            <Text className="text-zinc-300 font-medium">Go to Home (/home)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-full h-14 bg-[#1C1C1E] border border-zinc-800 rounded-lg flex items-center justify-center mb-3 active:scale-95"
                            onPress={() => router.push('/paywall')}
                        >
                            <Text className="text-zinc-300 font-medium">Go to Paywall (/paywall)</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-full h-14 bg-[#8B0000] border border-red-900 rounded-lg flex items-center justify-center active:scale-95"
                            onPress={() => DeviceEventEmitter.emit('onBlockTriggered')}
                        >
                            <Text className="text-white font-bold">Trigger Panic Overlay</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
