import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
// @ts-ignore
import { supabase } from '../utils/supabase';

export default function AuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    async function handleLogin() {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            Alert.alert('Login Failed', error.message);
        } else {
            router.replace('/home');
        }
    }

    async function handleSignUp() {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            Alert.alert('Sign Up Failed', error.message);
        } else {
            router.replace('/home');
        }
    }

    return (
        <View className="bg-black flex-1 items-center justify-center p-6">
            <Text className="text-white font-display text-2xl mb-8">
                SNAP // AUTH TERMINAL
            </Text>

            <TextInput
                className="w-full bg-zinc-900 text-white p-4 mb-4 border border-zinc-700"
                placeholder="EMAIL"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />
            <TextInput
                className="w-full bg-zinc-900 text-white p-4 mb-8 border border-zinc-700"
                placeholder="PASSWORD"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                className="w-full bg-blue-600 p-4 mb-4 items-center"
                onPress={handleLogin}
            >
                <Text className="text-white font-bold">LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity
                className="w-full bg-transparent border border-white p-4 items-center"
                onPress={handleSignUp}
            >
                <Text className="text-white font-bold">SIGN UP</Text>
            </TouchableOpacity>
        </View>
    );
}
