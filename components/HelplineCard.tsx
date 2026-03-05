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
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacityAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
        ]).start();

        Animated.loop(Animated.sequence([
            Animated.timing(pulseAnim, { toValue: 1.1, duration: 800, useNativeDriver: true }),
            Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])).start();

        Animated.loop(Animated.sequence([
            Animated.timing(shimmerAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
            Animated.timing(shimmerAnim, { toValue: 0, duration: 2500, useNativeDriver: true }),
        ])).start();
    }, []);

    const callHelpline = () => {
        Linking.openURL(Platform.OS !== 'android' ? 'telprompt:1930' : 'tel:1930');
    };

    const shimmerOpacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.85, 1],
    });

    return (
        <Animated.View style={[styles.container, { opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>
            <Animated.View style={{ opacity: shimmerOpacity }}>
                <LinearGradient
                    colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <View style={styles.iconContainer}>
                        <View style={styles.iconGlow}>
                            <Ionicons name="shield-checkmark" size={30} color={Colors.wheat} />
                        </View>
                    </View>

                    <View style={styles.textBlock}>
                        <Text style={styles.title}>{t.helpline.title}</Text>
                        <Text style={styles.subtitle}>{t.helpline.subtitle}</Text>
                    </View>

                    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                        <TouchableOpacity style={styles.callBtn} onPress={callHelpline} activeOpacity={0.75}>
                            <View style={styles.callBtnInner}>
                                <Ionicons name="call" size={18} color={Colors.primaryDark} />
                                <Text style={styles.callText}>1930</Text>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </LinearGradient>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20, overflow: 'hidden', marginVertical: Spacing.m,
        shadowColor: Colors.primaryDark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 8,
    },
    gradient: {
        flexDirection: 'row', alignItems: 'center',
        padding: Spacing.m, paddingVertical: Spacing.l,
        justifyContent: 'space-between',
    },
    iconContainer: { marginRight: Spacing.m },
    iconGlow: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)',
    },
    textBlock: { flex: 1, marginRight: Spacing.s },
    title: { fontSize: 16, fontWeight: '800', color: Colors.wheat, letterSpacing: 0.3 },
    subtitle: { fontSize: 12, color: 'rgba(245,222,179,0.75)', marginTop: 3, lineHeight: 16 },
    callBtn: {
        borderRadius: 22, overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 4,
    },
    callBtnInner: {
        backgroundColor: Colors.wheat,
        paddingHorizontal: 20, paddingVertical: 12,
        borderRadius: 22, flexDirection: 'row', alignItems: 'center',
    },
    callText: { fontSize: 20, fontWeight: '900', color: Colors.primaryDark, marginLeft: 6, letterSpacing: 1 },
});
