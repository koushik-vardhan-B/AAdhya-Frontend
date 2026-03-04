import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { HelplineCard } from '../components/HelplineCard';
import { Colors, Spacing } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { analyzeMessage } from '../services/api';

export default function HomeScreen() {
    const router = useRouter();
    const { t, locale } = useLanguage();
    const [message, setMessage] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Animations
    const headerY = useRef(new Animated.Value(-40)).current;
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const inputCard = useRef(new Animated.Value(0.95)).current;
    const inputOpacity = useRef(new Animated.Value(0)).current;
    const tipsY = useRef(new Animated.Value(40)).current;
    const tipsOpacity = useRef(new Animated.Value(0)).current;
    const scannerAnim = useRef(new Animated.Value(0)).current;
    const borderGlow = useRef(new Animated.Value(0)).current;
    const btnPulse = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(headerOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(headerY, { toValue: 0, duration: 700, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(inputOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.spring(inputCard, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(tipsOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.timing(tipsY, { toValue: 0, duration: 500, useNativeDriver: true }),
            ]),
        ]).start();

        // Button idle pulse
        Animated.loop(Animated.sequence([
            Animated.timing(btnPulse, { toValue: 1.04, duration: 900, useNativeDriver: true }),
            Animated.timing(btnPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])).start();
    }, []);

    // Border glow when focused
    useEffect(() => {
        Animated.timing(borderGlow, { toValue: isFocused ? 1 : 0, duration: 300, useNativeDriver: false }).start();
    }, [isFocused]);

    const borderColor = borderGlow.interpolate({
        inputRange: [0, 1], outputRange: [Colors.border, Colors.secondary],
    });

    const handleAnalyze = async () => {
        if (!message.trim()) { alert(t.home.pasteMessage); return; }
        setIsAnalyzing(true);

        // Looping scanner animation while "analyzing"
        const scanLoop = Animated.loop(Animated.sequence([
            Animated.timing(scannerAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.timing(scannerAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
        ]));
        scanLoop.start();

        try {
            const result = await analyzeMessage(message.trim(), locale);
            scanLoop.stop();
            router.push({ pathname: '/result', params: { resultData: JSON.stringify(result) } });
        } catch (error: any) {
            scanLoop.stop();
            alert(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const scannerBounce = scannerAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

    const tips: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
        { icon: 'close-circle-outline', text: t.home.tipOtp },
        { icon: 'link-outline', text: t.home.tipLinks },
        { icon: 'business-outline', text: t.home.tipBank },
        { icon: 'cash-outline', text: t.home.tipJob },
    ];

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <LinearGradient colors={[Colors.backgroundDark, Colors.background, '#fff8e7']} style={styles.gradientBg}>
                <ScrollView contentContainerStyle={styles.scroll}>

                    {/* Header */}
                    <Animated.View style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
                        <LinearGradient colors={[Colors.primaryLight, Colors.primary]} style={styles.headerBadge}>
                            <Ionicons name="shield-checkmark" size={28} color={Colors.wheat} />
                        </LinearGradient>
                        <Text style={styles.headerTitle}>{t.home.appName}</Text>
                        <View style={styles.headerSubRow}>
                            <Ionicons name="leaf-outline" size={14} color={Colors.secondaryDark} style={{ marginRight: 4 }} />
                            <Text style={styles.headerSub}>{t.home.headerSub}</Text>
                        </View>
                    </Animated.View>

                    {/* Input Section */}
                    <Animated.View style={[styles.section, { opacity: inputOpacity, transform: [{ scale: inputCard }] }]}>
                        <View style={styles.sectionLabelRow}>
                            <Ionicons name="search-outline" size={18} color={Colors.text} style={{ marginRight: 6 }} />
                            <Text style={styles.sectionLabel}>{t.home.sectionLabel}</Text>
                        </View>
                        <Text style={styles.sectionDesc}>{t.home.sectionDesc}</Text>

                        <Animated.View style={[styles.textAreaWrapper, { borderColor }]}>
                            <TextInput
                                style={styles.textArea}
                                placeholder={t.home.textAreaPlaceholder}
                                placeholderTextColor={Colors.textMuted}
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                                value={message}
                                onChangeText={setMessage}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                            />
                        </Animated.View>

                        {isAnalyzing ? (
                            <View style={styles.analyzingContainer}>
                                <ActivityIndicator size="large" color={Colors.primary} />
                                <Animated.View style={[styles.analyzingRow, { opacity: scannerBounce }]}>
                                    <Ionicons name="flask-outline" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                                    <Text style={styles.analyzingText}>{t.home.analyzingTitle}</Text>
                                </Animated.View>
                                <Text style={styles.analyzingSubText}>{t.home.analyzingSub}</Text>
                            </View>
                        ) : (
                            <Animated.View style={{ transform: [{ scale: btnPulse }] }}>
                                <TouchableOpacity onPress={handleAnalyze} activeOpacity={0.85} style={styles.checkBtn}>
                                    <LinearGradient colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.checkBtnGradient}>
                                        <Ionicons name="search" size={20} color={Colors.wheat} />
                                        <Text style={styles.checkBtnText}>  {t.home.checkNow}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </Animated.View>

                    {/* Safety Tips */}
                    <Animated.View style={[styles.tipsCard, { opacity: tipsOpacity, transform: [{ translateY: tipsY }] }]}>
                        <View style={styles.tipsTitleRow}>
                            <Ionicons name="bulb-outline" size={18} color={Colors.secondary} style={{ marginRight: 6 }} />
                            <Text style={styles.tipsTitle}>{t.home.tipsTitle}</Text>
                        </View>
                        {tips.map((tip, i) => (
                            <View key={i} style={styles.tipRow}>
                                <Ionicons name={tip.icon} size={16} color={Colors.textLight} style={{ marginRight: Spacing.s, marginTop: 2 }} />
                                <Text style={styles.tipText}>{tip.text}</Text>
                            </View>
                        ))}
                    </Animated.View>

                    {/* Helpline */}
                    <Animated.View style={{ opacity: tipsOpacity }}>
                        <HelplineCard />
                    </Animated.View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradientBg: { flex: 1 },
    scroll: { padding: Spacing.l, paddingBottom: Spacing.xxl },

    header: { alignItems: 'center', marginBottom: Spacing.xl, paddingTop: Spacing.l },
    headerBadge: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.s, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
    headerTitle: { fontSize: 26, fontWeight: '900', color: Colors.primaryDark, letterSpacing: 2 },
    headerSubRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
    headerSub: { fontSize: 14, color: Colors.secondaryDark, fontWeight: '600' },

    section: {
        backgroundColor: Colors.surface, borderRadius: 20, padding: Spacing.l, marginBottom: Spacing.l,
        borderWidth: 1.5, borderColor: Colors.border,
        shadowColor: Colors.soil, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 4,
    },
    sectionLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    sectionLabel: { fontSize: 18, fontWeight: '800', color: Colors.text },
    sectionDesc: { fontSize: 13, color: Colors.textLight, marginBottom: Spacing.m },

    textAreaWrapper: {
        borderWidth: 2, borderRadius: 14, backgroundColor: Colors.backgroundDark,
        marginBottom: Spacing.m, overflow: 'hidden',
    },
    textArea: { height: 140, fontSize: 15, color: Colors.text, padding: Spacing.m },

    analyzingContainer: { alignItems: 'center', paddingVertical: Spacing.l },
    analyzingRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.s },
    analyzingText: { fontSize: 17, fontWeight: '700', color: Colors.primary },
    analyzingSubText: { fontSize: 12, color: Colors.textLight, marginTop: 4, textAlign: 'center' },

    checkBtn: { borderRadius: 14, overflow: 'hidden', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
    checkBtnGradient: { flexDirection: 'row', paddingVertical: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 14 },
    checkBtnText: { fontSize: 18, fontWeight: '900', color: Colors.wheat, letterSpacing: 1 },

    tipsCard: {
        backgroundColor: Colors.surface, borderRadius: 16, padding: Spacing.l, marginBottom: Spacing.m,
        borderLeftWidth: 5, borderColor: Colors.secondary,
        shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
    },
    tipsTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.m },
    tipsTitle: { fontSize: 17, fontWeight: '800', color: Colors.secondary },
    tipRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.s },
    tipText: { fontSize: 14, color: Colors.text, flex: 1, lineHeight: 20 },
});
