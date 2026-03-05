import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator, Animated, KeyboardAvoidingView, Platform,
    ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { analyzeMessage } from '../services/api';

export default function AnalyzeScreen() {
    const router = useRouter();
    const { t, locale } = useLanguage();
    const [message, setMessage] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    // Animations
    const headerY = useRef(new Animated.Value(-30)).current;
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(0.95)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const tipsY = useRef(new Animated.Value(40)).current;
    const tipsOpacity = useRef(new Animated.Value(0)).current;
    const btnPulse = useRef(new Animated.Value(1)).current;
    const borderGlow = useRef(new Animated.Value(0)).current;
    const scannerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(headerOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.timing(headerY, { toValue: 0, duration: 600, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(cardOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.spring(cardScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(tipsOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
                Animated.timing(tipsY, { toValue: 0, duration: 400, useNativeDriver: true }),
            ]),
        ]).start();

        Animated.loop(Animated.sequence([
            Animated.timing(btnPulse, { toValue: 1.03, duration: 1000, useNativeDriver: true }),
            Animated.timing(btnPulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
        ])).start();
    }, []);

    useEffect(() => {
        Animated.timing(borderGlow, { toValue: isFocused ? 1 : 0, duration: 300, useNativeDriver: false }).start();
    }, [isFocused]);

    const borderColor = borderGlow.interpolate({
        inputRange: [0, 1],
        outputRange: [Colors.border, Colors.accentBlue],
    });

    const handleAnalyze = async () => {
        if (!message.trim()) { alert(t.analyze.pasteMessage); return; }
        setIsAnalyzing(true);
        const scanLoop = Animated.loop(Animated.sequence([
            Animated.timing(scannerAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
            Animated.timing(scannerAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
        ]));
        scanLoop.start();
        try {
            const result = await analyzeMessage(message.trim(), locale);
            scanLoop.stop();
            router.push({ pathname: '/result', params: { resultData: JSON.stringify(result) } });
        } catch (error: any) {
            scanLoop.stop();
            alert(error.message || 'Something went wrong. Please try again.');
        } finally { setIsAnalyzing(false); }
    };

    const scannerBounce = scannerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

    const tips: { icon: keyof typeof Ionicons.glyphMap; text: string }[] = [
        { icon: 'close-circle-outline', text: t.analyze.tip1 },
        { icon: 'link-outline', text: t.analyze.tip2 },
        { icon: 'cash-outline', text: t.analyze.tip3 },
    ];

    return (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <LinearGradient colors={[Colors.backgroundDark, Colors.background, '#fff8e7']} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.scroll}>

                    {/* Header */}
                    <Animated.View style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerY }] }]}>
                        <LinearGradient colors={[Colors.accentBlue, Colors.primaryLight]} style={styles.iconBadge}>
                            <Ionicons name="scan-outline" size={28} color="#fff" />
                        </LinearGradient>
                        <Text style={styles.title}>{t.analyze.title}</Text>
                        <Text style={styles.subtitle}>{t.analyze.subtitle}</Text>
                    </Animated.View>

                    {/* Input Card */}
                    <Animated.View style={[styles.inputCard, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
                        <View style={styles.inputLabelRow}>
                            <Ionicons name="chatbubble-ellipses-outline" size={18} color={Colors.text} style={{ marginRight: 6 }} />
                            <Text style={styles.inputLabel}>Paste Suspicious Message</Text>
                        </View>
                        <Text style={styles.inputDesc}>Copy the SMS, WhatsApp, or email text and paste it below</Text>

                        <Animated.View style={[styles.textAreaWrapper, { borderColor }]}>
                            <TextInput
                                style={styles.textArea}
                                placeholder={t.analyze.placeholder}
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

                        <Text style={styles.charCount}>{message.length} / 5000</Text>

                        {isAnalyzing ? (
                            <View style={styles.analyzingContainer}>
                                <ActivityIndicator size="large" color={Colors.accentBlue} />
                                <Animated.View style={[styles.analyzingRow, { opacity: scannerBounce }]}>
                                    <Ionicons name="flask-outline" size={18} color={Colors.accentBlue} style={{ marginRight: 6 }} />
                                    <Text style={styles.analyzingText}>{t.analyze.analyzing}</Text>
                                </Animated.View>
                                <Text style={styles.analyzingSub}>Running dual-layer AI detection…</Text>
                            </View>
                        ) : (
                            <Animated.View style={{ transform: [{ scale: btnPulse }] }}>
                                <TouchableOpacity onPress={handleAnalyze} activeOpacity={0.85} style={styles.analyzeBtn}>
                                    <LinearGradient
                                        colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.analyzeBtnGrad}
                                    >
                                        <Ionicons name="search" size={20} color={Colors.wheat} />
                                        <Text style={styles.analyzeBtnText}>  {t.analyze.checkNow}</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </Animated.View>

                    {/* Tips Card */}
                    <Animated.View style={[styles.tipsCard, { opacity: tipsOpacity, transform: [{ translateY: tipsY }] }]}>
                        <View style={styles.tipsTitleRow}>
                            <Ionicons name="bulb-outline" size={18} color={Colors.secondary} style={{ marginRight: 6 }} />
                            <Text style={styles.tipsTitle}>{t.analyze.tipsTitle}</Text>
                        </View>
                        {tips.map((tip, i) => (
                            <View key={i} style={styles.tipRow}>
                                <Ionicons name={tip.icon} size={16} color={Colors.textLight} style={{ marginRight: Spacing.s, marginTop: 2 }} />
                                <Text style={styles.tipText}>{tip.text}</Text>
                            </View>
                        ))}
                    </Animated.View>

                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    scroll: { padding: Spacing.l, paddingBottom: Spacing.xxl },

    header: { alignItems: 'center', marginBottom: Spacing.xl, paddingTop: Spacing.l },
    iconBadge: {
        width: 64, height: 64, borderRadius: 32,
        justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.s,
        shadowColor: Colors.accentBlue, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
    },
    title: { fontSize: 24, fontWeight: '900', color: Colors.primaryDark, letterSpacing: 1 },
    subtitle: { fontSize: 14, color: Colors.textLight, textAlign: 'center', marginTop: 4, lineHeight: 20 },

    inputCard: {
        backgroundColor: Colors.surface, borderRadius: 22, padding: Spacing.l, marginBottom: Spacing.l,
        borderWidth: 1.5, borderColor: Colors.border,
        shadowColor: Colors.soil, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.14, shadowRadius: 16, elevation: 5,
    },
    inputLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    inputLabel: { fontSize: 18, fontWeight: '800', color: Colors.text },
    inputDesc: { fontSize: 13, color: Colors.textLight, marginBottom: Spacing.m },

    textAreaWrapper: {
        borderWidth: 2, borderRadius: 16, backgroundColor: Colors.backgroundDark,
        marginBottom: Spacing.s, overflow: 'hidden',
    },
    textArea: { height: 150, fontSize: 15, color: Colors.text, padding: Spacing.m, lineHeight: 22 },

    charCount: { fontSize: 11, color: Colors.textMuted, textAlign: 'right', marginBottom: Spacing.m },

    analyzingContainer: { alignItems: 'center', paddingVertical: Spacing.l },
    analyzingRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.s },
    analyzingText: { fontSize: 17, fontWeight: '700', color: Colors.accentBlue },
    analyzingSub: { fontSize: 12, color: Colors.textLight, marginTop: 4 },

    analyzeBtn: {
        borderRadius: 16, overflow: 'hidden',
        shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 5,
    },
    analyzeBtnGrad: {
        flexDirection: 'row', paddingVertical: 18,
        alignItems: 'center', justifyContent: 'center', borderRadius: 16,
    },
    analyzeBtnText: { fontSize: 18, fontWeight: '900', color: Colors.wheat, letterSpacing: 1 },

    tipsCard: {
        backgroundColor: Colors.surface, borderRadius: 18, padding: Spacing.l,
        borderLeftWidth: 5, borderLeftColor: Colors.secondary,
        shadowColor: Colors.secondary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
    },
    tipsTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.m },
    tipsTitle: { fontSize: 17, fontWeight: '800', color: Colors.secondary },
    tipRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.s },
    tipText: { fontSize: 14, color: Colors.text, flex: 1, lineHeight: 20 },
});
