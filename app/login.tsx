import { Macondo_400Regular, useFonts } from '@expo-google-fonts/macondo';
import { Ionicons } from '@expo/vector-icons';
import { makeRedirectUri } from 'expo-auth-session';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';

export default function LoginScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const [fontsLoaded] = useFonts({ Macondo_400Regular });
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Animations
    const cardAnim = useRef(new Animated.Value(60)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;
    const inputSlide1 = useRef(new Animated.Value(40)).current;
    const inputSlide2 = useRef(new Animated.Value(40)).current;
    const btnScale = useRef(new Animated.Value(0.8)).current;
    const btnOpacity = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }),
                Animated.timing(logoRotate, { toValue: 1, duration: 600, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(cardOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.spring(cardAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
            ]),
            Animated.stagger(120, [
                Animated.timing(inputSlide1, { toValue: 0, duration: 400, useNativeDriver: true }),
                Animated.timing(inputSlide2, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.spring(btnScale, { toValue: 1, tension: 70, friction: 5, useNativeDriver: true }),
                Animated.timing(btnOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();

        // Logo pulse
        Animated.loop(Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        ])).start();
    }, []);

    const logoSpin = logoRotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            alert(t.login.fillAllFields);
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
        });
        setLoading(false);
        if (error) { alert(error.message); return; }
        router.replace('/home');
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        if (Platform.OS === 'web') {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin + '/home' },
            });
            if (error) { setLoading(false); alert(error.message); }
            return;
        }
        const redirectUrl = makeRedirectUri();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: redirectUrl },
        });
        if (error) { setLoading(false); alert(error.message); return; }
        if (data?.url) {
            const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
            if (result.type === 'success' && result.url) {
                const url = new URL(result.url);
                const params = new URLSearchParams(url.hash.substring(1));
                const accessToken = params.get('access_token');
                const refreshToken = params.get('refresh_token');
                if (accessToken && refreshToken) {
                    await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
                    setLoading(false);
                    router.replace('/home');
                    return;
                }
            }
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <LinearGradient colors={[Colors.backgroundDark, Colors.background, '#FFF8E7']} style={styles.gradientBg}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Logo */}
                    <Animated.View style={[styles.logoContainer, { transform: [{ scale: Animated.multiply(logoScale, pulseAnim) }, { rotate: logoSpin }] }]}>
                        <LinearGradient colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]} style={styles.logoBg}>
                            <Ionicons name="shield-checkmark" size={44} color={Colors.wheat} />
                        </LinearGradient>
                    </Animated.View>
                    <Text style={[styles.appName, fontsLoaded && { fontFamily: 'Macondo_400Regular' }]}>Rakshana AI</Text>

                    {/* Card */}
                    <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ translateY: cardAnim }] }]}>
                        <Text style={[styles.cardTitle, fontsLoaded && { fontFamily: 'Macondo_400Regular' }]}>{t.login.welcomeBack}</Text>
                        <Text style={styles.cardSubtitle}>{t.login.signInSubtitle}</Text>

                        {/* Email */}
                        <Animated.View style={[styles.inputGroup, { transform: [{ translateY: inputSlide1 }] }]}>
                            <Text style={styles.label}>{t.login.emailLabel}</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t.login.emailPlaceholder}
                                    placeholderTextColor={Colors.textMuted}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </Animated.View>

                        {/* Password */}
                        <Animated.View style={[styles.inputGroup, { transform: [{ translateY: inputSlide2 }] }]}>
                            <Text style={styles.label}>{t.login.passwordLabel}</Text>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    style={styles.input}
                                    placeholder={t.login.passwordPlaceholder}
                                    placeholderTextColor={Colors.textMuted}
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textLight} />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        <TouchableOpacity style={styles.forgotContainer}>
                            <Text style={styles.forgotText}>{t.login.forgotPassword}</Text>
                        </TouchableOpacity>

                        {/* Login Button */}
                        <Animated.View style={{ opacity: btnOpacity, transform: [{ scale: btnScale }] }}>
                            {loading ? (
                                <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: Spacing.m }} />
                            ) : (
                                <TouchableOpacity onPress={handleLogin} style={styles.loginBtn} activeOpacity={0.85}>
                                    <LinearGradient colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.loginBtnGradient}>
                                        <Text style={styles.loginBtnText}>{t.login.signIn}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            )}
                        </Animated.View>

                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>OR</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Google */}
                        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleLogin} disabled={loading} activeOpacity={0.8}>
                            <Text style={styles.googleText}>{t.login.continueWithGoogle}</Text>
                        </TouchableOpacity>

                        <View style={styles.signupRow}>
                            <Text style={styles.signupText}>{t.login.newHere}</Text>
                            <TouchableOpacity onPress={() => router.push('/signup')}>
                                <Text style={styles.signupLink}>{t.login.createAccount}</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradientBg: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: Spacing.l, paddingTop: Spacing.xxl },

    logoContainer: {
        alignSelf: 'center',
        marginBottom: Spacing.s,
        borderRadius: 40,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 10,
    },
    logoBg: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },

    appName: { fontSize: 32, fontWeight: '900', color: Colors.primaryDark, textAlign: 'center', letterSpacing: 3, marginBottom: Spacing.s },
    tagline: { fontSize: 13, color: Colors.secondary, textAlign: 'center', marginBottom: Spacing.xl, letterSpacing: 0.5 },

    card: {
        backgroundColor: Colors.surface,
        borderRadius: 20,
        padding: Spacing.xl,
        borderWidth: 1.5,
        borderColor: Colors.border,
        shadowColor: Colors.soil,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 6,
    },
    cardTitle: { fontSize: 36, fontWeight: '400', color: Colors.primaryDark, textAlign: 'center', letterSpacing: 1, marginBottom: 4 },
    cardSubtitle: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.l, letterSpacing: 0.3 },

    inputGroup: { marginBottom: Spacing.m },
    label: { fontSize: 13, fontWeight: '600', color: Colors.textLight, marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' },
    inputWrapper: {
        flexDirection: 'row', alignItems: 'center',
        borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12,
        paddingHorizontal: Spacing.m, backgroundColor: Colors.backgroundDark, height: 52,
    },
    input: { flex: 1, fontSize: 16, color: Colors.text },

    forgotContainer: { alignItems: 'flex-end', marginBottom: Spacing.m },
    forgotText: { fontSize: 13, color: Colors.primary, fontWeight: '500', fontStyle: 'italic' },

    loginBtn: { borderRadius: 14, overflow: 'hidden', elevation: 4, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
    loginBtnGradient: { paddingVertical: 16, alignItems: 'center', borderRadius: 14 },
    loginBtnText: { fontSize: 17, fontWeight: '700', color: Colors.wheat, letterSpacing: 2 },

    dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.l },
    dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
    dividerText: { marginHorizontal: Spacing.m, fontSize: 12, color: Colors.textMuted, fontWeight: '700' },

    googleBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14,
        paddingVertical: 13, backgroundColor: Colors.surface,
    },
    googleIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#4285F4', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.s },
    googleG: { color: '#fff', fontSize: 16, fontWeight: '900' },
    googleText: { fontSize: 16, fontWeight: '700', color: Colors.text },

    signupRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.l },
    signupText: { fontSize: 14, color: Colors.textLight },
    signupLink: { fontSize: 14, color: Colors.secondaryDark, fontWeight: '800' },
});
