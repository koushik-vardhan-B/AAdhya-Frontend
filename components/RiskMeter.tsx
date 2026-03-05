import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

interface RiskMeterProps {
    score: number;
    classification: 'Safe' | 'Suspicious' | 'High Risk';
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, classification }) => {
    const { t } = useLanguage();

    // Animations
    const fillAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const glowPulse = useRef(new Animated.Value(0.6)).current;
    const indicatorAnim = useRef(new Animated.Value(0)).current;

    // Colors by classification
    const getColors = () => {
        if (classification === 'Safe') return {
            primary: Colors.safeGlow,
            gradient: ['#059669', Colors.safeGlow, '#4ADE80'] as [string, string, string],
            icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
            bgGlow: 'rgba(34,197,94,0.15)',
        };
        if (classification === 'Suspicious') return {
            primary: Colors.warningGlow,
            gradient: ['#D97706', Colors.warningGlow, '#FCD34D'] as [string, string, string],
            icon: 'alert-circle' as keyof typeof Ionicons.glyphMap,
            bgGlow: 'rgba(245,158,11,0.15)',
        };
        return {
            primary: Colors.dangerGlow,
            gradient: ['#B91C1C', Colors.dangerGlow, '#FCA5A5'] as [string, string, string],
            icon: 'alert' as keyof typeof Ionicons.glyphMap,
            bgGlow: 'rgba(239,68,68,0.15)',
        };
    };

    const colors = getColors();

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(fillAnim, { toValue: score, duration: 1400, useNativeDriver: false }),
                Animated.timing(indicatorAnim, { toValue: score, duration: 1400, useNativeDriver: false }),
            ]),
        ]).start();

        // Glow pulse for high risk
        if (classification === 'High Risk') {
            Animated.loop(Animated.sequence([
                Animated.timing(glowPulse, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(glowPulse, { toValue: 0.5, duration: 800, useNativeDriver: true }),
            ])).start();
        }
    }, [score]);

    const fillWidth = fillAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    const indicatorLeft = indicatorAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '96%'],
    });

    return (
        <Animated.View style={[styles.container, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
            <View style={[styles.innerCard, { backgroundColor: colors.bgGlow }]}>

                {/* Score Display */}
                <View style={styles.scoreSection}>
                    <Animated.View style={{ opacity: classification === 'High Risk' ? glowPulse : opacityAnim }}>
                        <Ionicons name={colors.icon} size={36} color={colors.primary} />
                    </Animated.View>
                    <View style={styles.scoreTextBlock}>
                        <Text style={[styles.scoreNumber, { color: colors.primary }]}>{score}%</Text>
                        <Text style={styles.scoreLabel}>{t.riskMeter.scamProbability}</Text>
                    </View>
                </View>

                {/* Segmented Gauge Track */}
                <View style={styles.gaugeContainer}>
                    {/* Background segments */}
                    <View style={styles.segmentRow}>
                        <View style={[styles.segment, styles.segmentSafe]} />
                        <View style={[styles.segment, styles.segmentWarning]} />
                        <View style={[styles.segment, styles.segmentDanger]} />
                    </View>

                    {/* Animated fill overlay */}
                    <View style={styles.fillTrack}>
                        <Animated.View style={[styles.fillBar, { width: fillWidth }]}>
                            <LinearGradient
                                colors={colors.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={StyleSheet.absoluteFill}
                            />
                        </Animated.View>
                    </View>

                    {/* Animated indicator dot */}
                    <Animated.View style={[styles.indicator, { left: indicatorLeft }]}>
                        <View style={[styles.indicatorDot, { backgroundColor: colors.primary, shadowColor: colors.primary }]} />
                    </Animated.View>
                </View>

                {/* Range Labels */}
                <View style={styles.rangeRow}>
                    <View style={styles.rangeItem}>
                        <View style={[styles.rangeDot, { backgroundColor: Colors.safeGlow }]} />
                        <Text style={[styles.rangeLabel, { color: Colors.safeGlow }]}>{t.riskMeter.safe}</Text>
                    </View>
                    <View style={styles.rangeItem}>
                        <View style={[styles.rangeDot, { backgroundColor: Colors.warningGlow }]} />
                        <Text style={[styles.rangeLabel, { color: Colors.warningGlow }]}>{t.riskMeter.suspicious}</Text>
                    </View>
                    <View style={styles.rangeItem}>
                        <View style={[styles.rangeDot, { backgroundColor: Colors.dangerGlow }]} />
                        <Text style={[styles.rangeLabel, { color: Colors.dangerGlow }]}>{t.riskMeter.highRisk}</Text>
                    </View>
                </View>

                {/* Classification Badge */}
                <View style={[styles.badge, { backgroundColor: colors.primary + '22', borderColor: colors.primary }]}>
                    <Ionicons name={colors.icon} size={16} color={colors.primary} style={{ marginRight: 6 }} />
                    <Text style={[styles.badgeText, { color: colors.primary }]}>
                        {classification.toUpperCase()}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 22, marginVertical: Spacing.s, overflow: 'hidden',
        shadowColor: Colors.soil, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 6,
        borderWidth: 1.5, borderColor: Colors.border,
    },
    innerCard: {
        padding: Spacing.l, borderRadius: 22,
    },

    // Score display
    scoreSection: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.l },
    scoreTextBlock: { marginLeft: Spacing.m },
    scoreNumber: { fontSize: 42, fontWeight: '900', letterSpacing: -1 },
    scoreLabel: { fontSize: 14, color: Colors.textLight, fontWeight: '600', marginTop: -2 },

    // Gauge
    gaugeContainer: { position: 'relative', marginBottom: Spacing.m, height: 28 },
    segmentRow: { flexDirection: 'row', height: 20, borderRadius: 10, overflow: 'hidden', position: 'absolute', top: 0, left: 0, right: 0 },
    segment: { flex: 1, opacity: 0.18 },
    segmentSafe: { backgroundColor: Colors.safeGlow, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
    segmentWarning: { backgroundColor: Colors.warningGlow },
    segmentDanger: { backgroundColor: Colors.dangerGlow, borderTopRightRadius: 10, borderBottomRightRadius: 10 },

    fillTrack: { position: 'absolute', top: 0, left: 0, right: 0, height: 20, borderRadius: 10, overflow: 'hidden' },
    fillBar: { height: '100%', borderRadius: 10, overflow: 'hidden' },

    indicator: { position: 'absolute', top: -2, width: 24, alignItems: 'center' },
    indicatorDot: {
        width: 24, height: 24, borderRadius: 12,
        borderWidth: 3, borderColor: Colors.surface,
        shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4,
    },

    // Range labels
    rangeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.m },
    rangeItem: { flexDirection: 'row', alignItems: 'center' },
    rangeDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
    rangeLabel: { fontSize: 11, fontWeight: '700' },

    // Badge
    badge: {
        alignSelf: 'center', paddingHorizontal: Spacing.l, paddingVertical: Spacing.s,
        borderRadius: 24, borderWidth: 2, flexDirection: 'row', alignItems: 'center',
    },
    badgeText: { fontSize: 16, fontWeight: '900', letterSpacing: 2 },
});
