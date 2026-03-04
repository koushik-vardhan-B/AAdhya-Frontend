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
    const animatedWidth = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    let color = Colors.safe;
    let gradColors: [string, string] = [Colors.secondaryLight, Colors.secondary];
    let iconName: keyof typeof Ionicons.glyphMap = 'checkmark-circle';

    if (classification === 'Suspicious') {
        color = Colors.suspicious;
        gradColors = ['#F5C518', Colors.suspicious];
        iconName = 'alert-circle';
    }
    if (classification === 'High Risk') {
        color = Colors.danger;
        gradColors = ['#E74C3C', Colors.danger];
        iconName = 'alert';
    }

    useEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, tension: 60, friction: 6, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            ]),
            Animated.timing(animatedWidth, { toValue: score, duration: 1200, useNativeDriver: false }),
        ]).start();

        // Continuous glow for high risk
        if (classification === 'High Risk') {
            Animated.loop(Animated.sequence([
                Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(glowAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
            ])).start();
        }
    }, [score]);

    const widthInterpolated = animatedWidth.interpolate({
        inputRange: [0, 100], outputRange: ['0%', '100%'],
    });

    return (
        <Animated.View style={[styles.container, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient colors={['rgba(0,0,0,0.02)', 'rgba(0,0,0,0.06)']} style={styles.innerGrad}>
                <View style={styles.topRow}>
                    <Animated.View style={{ opacity: classification === 'High Risk' ? glowAnim : opacityAnim, marginRight: Spacing.m }}>
                        <Ionicons name={iconName} size={32} color={color} />
                    </Animated.View>
                    <Text style={styles.scoreText}>
                        <Text style={[styles.scoreNum, { color }]}>{score}%</Text> {t.riskMeter.scamProbability}
                    </Text>
                </View>

                {/* Bar Track */}
                <View style={styles.track}>
                    <Animated.View style={[styles.fill, { width: widthInterpolated }]}>
                        <LinearGradient colors={gradColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
                    </Animated.View>
                </View>

                {/* Range labels */}
                <View style={styles.rangeRow}>
                    <Text style={[styles.rangeLabel, { color: Colors.safe }]}>{t.riskMeter.safe}</Text>
                    <Text style={[styles.rangeLabel, { color: Colors.suspicious }]}>{t.riskMeter.suspicious}</Text>
                    <Text style={[styles.rangeLabel, { color: Colors.danger }]}>{t.riskMeter.highRisk}</Text>
                </View>

                {/* Classification Badge */}
                <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}>
                    <Text style={[styles.badgeText, { color }]}>
                        {classification.toUpperCase()}
                    </Text>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20, marginVertical: Spacing.s, overflow: 'hidden',
        shadowColor: Colors.soil, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 12, elevation: 4,
        borderWidth: 1.5, borderColor: Colors.border,
    },
    innerGrad: { padding: Spacing.l },
    topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.m },
    scoreText: { fontSize: 16, color: Colors.textLight, fontWeight: '600' },
    scoreNum: { fontSize: 36, fontWeight: '900' },
    track: { height: 16, backgroundColor: Colors.backgroundDark, borderRadius: 8, overflow: 'hidden', marginBottom: Spacing.s },
    fill: { height: '100%', borderRadius: 8, overflow: 'hidden' },
    rangeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.m },
    rangeLabel: { fontSize: 11, fontWeight: '700' },
    badge: {
        alignSelf: 'center', paddingHorizontal: Spacing.l, paddingVertical: Spacing.s,
        borderRadius: 20, borderWidth: 2, marginTop: 4,
    },
    badgeText: { fontSize: 18, fontWeight: '900', letterSpacing: 2 },
});
