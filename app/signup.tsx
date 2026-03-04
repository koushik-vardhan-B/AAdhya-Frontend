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

export default function SignUpScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Animations
    const cardY = useRef(new Animated.Value(80)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const logoAnim = useRef(new Animated.Value(0)).current;
    const fieldsAnim = [useRef(new Animated.Value(40)).current, useRef(new Animated.Value(40)).current, useRef(new Animated.Value(40)).current, useRef(new Animated.Value(40)).current];
    const btnAnim = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.spring(logoAnim, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }),
            Animated.parallel([
                Animated.timing(cardOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.spring(cardY, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
            ]),
            Animated.stagger(100, fieldsAnim.map(f => Animated.timing(f, { toValue: 0, duration: 350, useNativeDriver: true }))),
            Animated.spring(btnAnim, { toValue: 1, tension: 70, friction: 5, useNativeDriver: true }),
        ]).start();

        Animated.loop(Animated.sequence([
            Animated.timing(bounceAnim, { toValue: 1.1, duration: 1200, useNativeDriver: true }),
            Animated.timing(bounceAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])).start();
    }, []);

    const handleSignUp = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            alert(t.signup.fillAllFields); return;
        }
        if (password !== confirmPassword) {
            alert(t.signup.passwordsMismatch); return;
        }
        setLoading(true);
        const { error } = await supabase.auth.signUp({
            email: email.trim(), password: password.trim(),
            options: { data: { full_name: name.trim() } },
        });
        setLoading(false);
        if (error) { alert(error.message); return; }
        alert(t.signup.accountCreated);
        router.replace('/login');
    };

    const handleGoogleSignUp = async () => {
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
        const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectUrl } });
        if (error) { setLoading(false); alert(error.message); return; }
        if (data?.url) {
            const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
            if (result.type === 'success' && result.url) {
                const url = new URL(result.url);
                const params = new URLSearchParams(url.hash.substring(1));
                const at = params.get('access_token'), rt = params.get('refresh_token');
                if (at && rt) {
                    await supabase.auth.setSession({ access_token: at, refresh_token: rt });
                    setLoading(false); router.replace('/home'); return;
                }
            }
        }
        setLoading(false);
    };

    const fields: { icon: keyof typeof Ionicons.glyphMap; label: string; placeholder: string; value: string; setter: (v: string) => void; anim: Animated.Value; keyboard?: any; secure?: boolean }[] = [
        { icon: 'person-outline', label: t.signup.fullNameLabel, placeholder: t.signup.fullNamePlaceholder, value: name, setter: setName, anim: fieldsAnim[0] },
        { icon: 'mail-outline', label: t.signup.emailLabel, placeholder: t.signup.emailPlaceholder, value: email, setter: setEmail, anim: fieldsAnim[1], keyboard: 'email-address' },
        { icon: 'lock-closed-outline', label: t.signup.passwordLabel, placeholder: t.signup.passwordPlaceholder, value: password, setter: setPassword, anim: fieldsAnim[2], secure: true },
        { icon: 'lock-closed-outline', label: t.signup.confirmPasswordLabel, placeholder: t.signup.confirmPasswordPlaceholder, value: confirmPassword, setter: setConfirmPassword, anim: fieldsAnim[3], secure: true },
    ];

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <LinearGradient colors={['#E8F5E9', Colors.background, Colors.backgroundDark]} style={styles.gradientBg}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Logo */}
                    <Animated.View style={[styles.logoWrap, { transform: [{ scale: Animated.multiply(logoAnim, bounceAnim) }] }]}>
                        <LinearGradient colors={[Colors.secondaryLight, Colors.secondary, Colors.secondaryDark]} style={styles.logoBg}>
                            <Ionicons name="person-add" size={40} color={Colors.wheat} />
                        </LinearGradient>
                    </Animated.View>
                    <Text style={styles.appName}>{t.signup.joinTitle}</Text>
                    <View style={styles.taglineRow}>
                        <Ionicons name="leaf" size={14} color={Colors.secondary} style={{ marginRight: 4 }} />
                        <Text style={styles.tagline}>{t.signup.tagline}</Text>
                    </View>

                    {/* Card */}
                    <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ translateY: cardY }] }]}>
                        <Text style={styles.cardTitle}>{t.signup.createAccount}</Text>

                        {fields.map((field, i) => (
                            <Animated.View key={i} style={[styles.inputGroup, { transform: [{ translateY: field.anim }] }]}>
                                <View style={styles.labelRow}>
                                    <Ionicons name={field.icon} size={14} color={Colors.textLight} style={{ marginRight: 6 }} />
                                    <Text style={styles.label}>{field.label}</Text>
                                </View>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder={field.placeholder}
                                        placeholderTextColor={Colors.textMuted}
                                        keyboardType={field.keyboard}
                                        autoCapitalize={field.keyboard === 'email-address' ? 'none' : 'words'}
                                        secureTextEntry={field.secure && !showPassword}
                                        value={field.value}
                                        onChangeText={field.setter}
                                    />
                                    {field.secure && i === 2 && (
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textLight} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </Animated.View>
                        ))}

                        {loading ? (
                            <ActivityIndicator size="large" color={Colors.secondary} style={{ marginVertical: Spacing.m }} />
                        ) : (
                            <TouchableOpacity onPress={handleSignUp} style={styles.signupBtn} activeOpacity={0.85}>
                                <LinearGradient colors={[Colors.secondaryLight, Colors.secondary, Colors.secondaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.signupBtnGradient}>
                                    <Text style={styles.signupBtnText}>{t.signup.createAccountBtn}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}

                        <View style={styles.dividerRow}>
                            <View style={styles.divLine} /><Text style={styles.divText}>OR</Text><View style={styles.divLine} />
                        </View>

                        <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleSignUp} disabled={loading} activeOpacity={0.8}>
                            <View style={styles.googleIcon}><Text style={styles.googleG}>G</Text></View>
                            <Text style={styles.googleText}>{t.signup.signUpWithGoogle}</Text>
                        </TouchableOpacity>

                        <View style={styles.loginRow}>
                            <Text style={styles.loginText}>{t.signup.alreadyHaveAccount}</Text>
                            <TouchableOpacity onPress={() => router.back()}>
                                <View style={styles.loginLinkRow}>
                                    <Text style={styles.loginLink}>{t.signup.signIn}</Text>
                                    <Ionicons name="leaf" size={12} color={Colors.primary} style={{ marginLeft: 4 }} />
                                </View>
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
    logoWrap: { alignSelf: 'center', marginBottom: Spacing.s, borderRadius: 40, shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 8 },
    logoBg: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
    appName: { fontSize: 28, fontWeight: '900', color: Colors.secondaryDark, textAlign: 'center', letterSpacing: 2, marginBottom: 4 },
    taglineRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.xl },
    tagline: { fontSize: 13, color: Colors.secondary, textAlign: 'center' },
    card: { backgroundColor: Colors.surface, borderRadius: 20, padding: Spacing.xl, borderWidth: 1.5, borderColor: Colors.border, shadowColor: Colors.soil, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 5 },
    cardTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: Spacing.l },
    inputGroup: { marginBottom: Spacing.m },
    labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    label: { fontSize: 14, fontWeight: '700', color: Colors.textLight },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: Spacing.m, backgroundColor: Colors.backgroundDark, height: 52 },
    input: { flex: 1, fontSize: 16, color: Colors.text },
    signupBtn: { borderRadius: 14, overflow: 'hidden', elevation: 4, shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
    signupBtnGradient: { paddingVertical: 16, alignItems: 'center', borderRadius: 14 },
    signupBtnText: { fontSize: 18, fontWeight: '800', color: Colors.wheat, letterSpacing: 1 },
    dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: Spacing.l },
    divLine: { flex: 1, height: 1, backgroundColor: Colors.border },
    divText: { marginHorizontal: Spacing.m, fontSize: 12, color: Colors.textMuted, fontWeight: '700' },
    googleBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.border, borderRadius: 14, paddingVertical: 13, backgroundColor: Colors.surface },
    googleIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#4285F4', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.s },
    googleG: { color: '#fff', fontSize: 16, fontWeight: '900' },
    googleText: { fontSize: 16, fontWeight: '700', color: Colors.text },
    loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.l },
    loginText: { fontSize: 14, color: Colors.textLight },
    loginLinkRow: { flexDirection: 'row', alignItems: 'center' },
    loginLink: { fontSize: 14, color: Colors.primary, fontWeight: '800' },
});
