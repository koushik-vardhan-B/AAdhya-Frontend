import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HelplineCard } from '../components/HelplineCard';
import { RiskMeter } from '../components/RiskMeter';
import { Colors, Spacing } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

interface AnalysisResult {
    message: string;
    is_fraud: boolean;
    scam_probability: number;
    risk_level: 'Safe' | 'Suspicious' | 'High Risk';
    fraud_type: string | null;
    suspicious_keywords: string[];
    prevention_tips: string[];
    explanation: string;
    helpline: string | null;
    // Translation fields
    explanation_original?: string;
    prevention_tips_original?: string[];
    translated_to?: string;
}

// Map fraud_type to icon (backend doesn't return icons)
const getFraudIcon = (fraudType: string | null): keyof typeof Ionicons.glyphMap => {
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
        "UPI Fraud": "card-outline",
        "Lottery Scam": "gift-outline",
        "Job Scam": "briefcase-outline",
        "Phishing": "fish-outline",
        "Others": "warning-outline",
    };
    return icons[fraudType || ""] || "alert-circle-outline";
};

// Animated card wrapper
const AnimatedCard = ({ children, delay = 0, style }: { children: React.ReactNode, delay?: number, style?: any }) => {
    const slideY = useRef(new Animated.Value(30)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.parallel([
                Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.spring(slideY, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
            ]),
        ]).start();
    }, []);
    return <Animated.View style={[style, { opacity, transform: [{ translateY: slideY }] }]}>{children}</Animated.View>;
};

export default function ResultScreen() {
    const { resultData } = useLocalSearchParams<{ resultData: string }>();
    const router = useRouter();
    const { t } = useLanguage();
    const [result, setResult] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        if (resultData) {
            try {
                const parsed = JSON.parse(resultData);
                setResult(parsed);
            } catch {
                // Fallback for invalid data
                setResult({
                    message: '',
                    is_fraud: false,
                    scam_probability: 0,
                    risk_level: 'Safe',
                    fraud_type: null,
                    suspicious_keywords: [],
                    prevention_tips: [],
                    explanation: 'Could not parse result data.',
                    helpline: '1930',
                });
            }
        }
    }, [resultData]);

    if (!result) return null;

    const riskColor = result.risk_level === 'Safe' ? Colors.safe : result.risk_level === 'Suspicious' ? Colors.suspicious : Colors.danger;
    const fraudIcon = getFraudIcon(result.fraud_type);
    const fraudTypeDisplay = result.fraud_type || t.result.normalMessage;

    const fraudTypeColors: Record<string, [string, string]> = {
        'Safe': [Colors.secondaryLight, Colors.secondary],
        'Suspicious': ['#F5C518', Colors.suspicious],
        'High Risk': ['#E74C3C', Colors.danger],
    };
    const headerGrad = fraudTypeColors[result.risk_level] || [Colors.primaryLight, Colors.primary];

    return (
        <LinearGradient colors={[Colors.backgroundDark, Colors.background]} style={styles.gradBg}>
            <ScrollView contentContainerStyle={styles.content}>

                {/* Header Banner */}
                <AnimatedCard delay={0} style={styles.headerBanner}>
                    <LinearGradient colors={[...headerGrad, 'rgba(0,0,0,0.6)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerBannerGrad}>
                        <Text style={styles.bannerLabel}>{t.result.analysisComplete}</Text>
                        <Text style={styles.bannerRisk}>{result.risk_level.toUpperCase()}</Text>
                    </LinearGradient>
                </AnimatedCard>

                {/* Risk Meter */}
                <AnimatedCard delay={100}>
                    <RiskMeter score={result.scam_probability} classification={result.risk_level} />
                </AnimatedCard>

                {/* Fraud Type + Keywords */}
                <AnimatedCard delay={200} style={styles.card}>
                    <View style={[styles.cardHeaderRow, { borderBottomColor: riskColor + '44' }]}>
                        <Ionicons name="warning-outline" size={22} color={riskColor} />
                        <Text style={styles.cardTitle}>{t.result.fraudTypeDetected}</Text>
                    </View>
                    <View style={styles.fraudTypeRow}>
                        <Ionicons name={fraudIcon} size={22} color={riskColor} style={{ marginRight: 8 }} />
                        <Text style={[styles.fraudType, { color: riskColor }]}>{fraudTypeDisplay}</Text>
                    </View>
                    {result.suspicious_keywords.length > 0 && (
                        <View style={styles.kwSection}>
                            <View style={styles.kwLabelRow}>
                                <Ionicons name="search-outline" size={14} color={Colors.textLight} style={{ marginRight: 4 }} />
                                <Text style={styles.kwLabel}>{t.result.suspiciousWords}</Text>
                            </View>
                            <View style={styles.kwRow}>
                                {result.suspicious_keywords.map((kw, i) => (
                                    <View key={i} style={[styles.kwBadge, { borderColor: riskColor }]}>
                                        <Text style={[styles.kwText, { color: riskColor }]}>{kw}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </AnimatedCard>

                {/* AI Explanation */}
                <AnimatedCard delay={300} style={styles.card}>
                    <View style={[styles.cardHeaderRow, { borderBottomColor: Colors.primaryLight + '55' }]}>
                        <Ionicons name="bulb-outline" size={22} color={Colors.primaryLight} />
                        <Text style={styles.cardTitle}>{t.result.whyThisResult}</Text>
                    </View>
                    <Text style={styles.explanation}>"{result.explanation}"</Text>
                </AnimatedCard>

                {/* Prevention Tips */}
                <AnimatedCard delay={400} style={[styles.card, styles.tipsCard]}>
                    <View style={[styles.cardHeaderRow, { borderBottomColor: Colors.secondaryLight + '55' }]}>
                        <Ionicons name="shield-checkmark-outline" size={22} color={Colors.secondary} />
                        <Text style={styles.cardTitle}>{t.result.preventionTips}</Text>
                    </View>
                    {result.prevention_tips.map((tip, i) => (
                        <View key={i} style={styles.tipRow}>
                            <Ionicons name="leaf-outline" size={14} color={Colors.secondary} style={{ marginRight: Spacing.s, marginTop: 3 }} />
                            <Text style={styles.tipText}>{tip}</Text>
                        </View>
                    ))}
                </AnimatedCard>

                {/* Helpline */}
                <AnimatedCard delay={500}>
                    <HelplineCard />
                </AnimatedCard>

                {/* Actions */}
                <AnimatedCard delay={600} style={styles.actions}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.outlineBtn}>
                        <View style={styles.outlineBtnRow}>
                            <Ionicons name="search-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
                            <Text style={styles.outlineBtnText}>{t.result.checkAnother}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.replace('/home')} style={styles.homeBtn}>
                        <View style={styles.outlineBtnRow}>
                            <Ionicons name="home-outline" size={16} color={Colors.wheat} style={{ marginRight: 6 }} />
                            <Text style={styles.homeBtnText}>{t.result.backToHome}</Text>
                        </View>
                    </TouchableOpacity>
                </AnimatedCard>

            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradBg: { flex: 1 },
    content: { padding: Spacing.m, paddingBottom: Spacing.xxl },

    headerBanner: { borderRadius: 16, overflow: 'hidden', marginBottom: Spacing.s, shadowColor: Colors.soil, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 5 },
    headerBannerGrad: { padding: Spacing.l, alignItems: 'center' },
    bannerLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600', letterSpacing: 1 },
    bannerRisk: { fontSize: 30, fontWeight: '900', color: '#fff', letterSpacing: 3, marginTop: 4 },

    card: {
        backgroundColor: Colors.surface, borderRadius: 16, padding: Spacing.m, marginVertical: Spacing.s,
        borderWidth: 1.5, borderColor: Colors.border,
        shadowColor: Colors.soil, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
    },
    tipsCard: { borderLeftWidth: 5, borderLeftColor: Colors.secondary },

    cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.m, paddingBottom: Spacing.s, borderBottomWidth: 1 },
    cardTitle: { fontSize: 17, fontWeight: '800', color: Colors.text, marginLeft: Spacing.s },

    fraudTypeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.s },
    fraudType: { fontSize: 22, fontWeight: '900' },

    kwSection: { marginTop: Spacing.s },
    kwLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.s },
    kwLabel: { fontSize: 13, color: Colors.textLight, fontWeight: '600' },
    kwRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    kwBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12, borderWidth: 1.5, backgroundColor: Colors.backgroundDark, margin: 2 },
    kwText: { fontSize: 13, fontWeight: '700' },

    explanation: { fontSize: 15, color: Colors.textLight, lineHeight: 24, fontStyle: 'italic' },

    tipRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.s },
    tipText: { fontSize: 14, color: Colors.text, flex: 1, lineHeight: 21 },

    actions: { marginTop: Spacing.m },
    outlineBtn: {
        borderWidth: 2, borderColor: Colors.primary, borderRadius: 12,
        paddingVertical: 14, alignItems: 'center', marginBottom: Spacing.s,
        backgroundColor: Colors.surface,
    },
    outlineBtnRow: { flexDirection: 'row', alignItems: 'center' },
    outlineBtnText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
    homeBtn: {
        borderRadius: 12, paddingVertical: 14, alignItems: 'center',
        backgroundColor: Colors.primary,
    },
    homeBtnText: { fontSize: 16, fontWeight: '700', color: Colors.wheat },
});
