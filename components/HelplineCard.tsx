import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export const HelplineCard = () => {
    const { t } = useLanguage();
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
        ]).start();

        Animated.loop(Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.12, duration: 700, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])).start();
    }, []);

    const callHelpline = () => {
        Linking.openURL(Platform.OS !== 'android' ? 'telprompt:1930' : 'tel:1930');
    };

    return (
        <Animated.View style={[styles.container, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>
            <LinearGradient colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
                <View style={styles.leftSection}>
                    <Ionicons name="shield-checkmark" size={32} color={Colors.wheat} />
                    <View style={styles.textBlock}>
                        <Text style={styles.title}>{t.helpline.title}</Text>
                        <Text style={styles.subtitle}>{t.helpline.subtitle}</Text>
                    </View>
                </View>

                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <TouchableOpacity style={styles.callBtn} onPress={callHelpline} activeOpacity={0.8}>
                        <Ionicons name="call" size={18} color={Colors.primary} />
                        <Text style={styles.callText}>1930</Text>
                    </TouchableOpacity>
                </Animated.View>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16, overflow: 'hidden', marginVertical: Spacing.m,
        shadowColor: Colors.primaryDark, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
    },
    gradient: { flexDirection: 'row', alignItems: 'center', padding: Spacing.m, justifyContent: 'space-between' },
    leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    textBlock: { marginLeft: Spacing.m, flex: 1 },
    title: { fontSize: 15, fontWeight: '800', color: Colors.wheat },
    subtitle: { fontSize: 12, color: 'rgba(245,222,179,0.8)', marginTop: 2 },
    callBtn: {
        backgroundColor: Colors.wheat, paddingHorizontal: 16, paddingVertical: 10,
        borderRadius: 20, flexDirection: 'row', alignItems: 'center',
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2,
    },
    callText: { fontSize: 18, fontWeight: '900', color: Colors.primary, marginLeft: 6 },
});
