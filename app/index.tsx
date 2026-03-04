import { Macondo_400Regular, useFonts } from '@expo-google-fonts/macondo';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { Colors, Spacing } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

// Floating leaf particle component
const FloatingLeaf = ({ delay, startX, size }: { delay: number, startX: number, size: number }) => {
    const translateY = useRef(new Animated.Value(-50)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const rotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const runAnimation = () => {
            translateY.setValue(-50);
            translateX.setValue(0);
            opacity.setValue(0);
            rotate.setValue(0);

            Animated.parallel([
                Animated.timing(translateY, { toValue: height + 50, duration: 6000 + delay * 500, useNativeDriver: true }),
                Animated.sequence([
                    Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
                    Animated.delay(4000),
                    Animated.timing(opacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
                ]),
                Animated.timing(translateX, { toValue: Math.sin(delay) * 60, duration: 6000 + delay * 500, useNativeDriver: true }),
                Animated.timing(rotate, { toValue: 1, duration: 6000 + delay * 500, useNativeDriver: true }),
            ]).start(() => setTimeout(runAnimation, Math.random() * 3000));
        };

        const timer = setTimeout(runAnimation, delay * 1000);
        return () => clearTimeout(timer);
    }, []);

    const rotation = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    return (
        <Animated.View style={{
            position: 'absolute',
            left: startX,
            top: 0,
            opacity,
            transform: [{ translateY }, { translateX }, { rotate: rotation }],
        }}>
            <Ionicons name="leaf-outline" size={size} color={Colors.secondaryLight} />
        </Animated.View>
    );
};

export default function LandingScreen() {
    const router = useRouter();
    const { t } = useLanguage();

    const [fontsLoaded] = useFonts({ Macondo_400Regular });

    // Title animations
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleScale = useRef(new Animated.Value(0.6)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const subtitleY = useRef(new Animated.Value(20)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(0.7)).current;
    const glowPulse = useRef(new Animated.Value(0)).current;
    const badgeAnim = useRef(new Animated.Value(0)).current;
    const buttonShimmer = useRef(new Animated.Value(0)).current;
    const taglineY = useRef(new Animated.Value(30)).current;
    const taglineOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(300),
            Animated.parallel([
                Animated.spring(titleScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
                Animated.timing(titleOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(subtitleOpacity, { toValue: 1, duration: 700, useNativeDriver: true }),
                Animated.timing(subtitleY, { toValue: 0, duration: 700, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(taglineOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
                Animated.timing(taglineY, { toValue: 0, duration: 600, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.spring(buttonScale, { toValue: 1, tension: 70, friction: 5, useNativeDriver: true }),
                Animated.timing(buttonOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
            ]),
            Animated.timing(badgeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]).start();

        // Glow pulse (continuous)
        Animated.loop(Animated.sequence([
            Animated.timing(glowPulse, { toValue: 1, duration: 2000, useNativeDriver: true }),
            Animated.timing(glowPulse, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])).start();

        // Button shimmer (continuous)
        Animated.loop(Animated.sequence([
            Animated.timing(buttonShimmer, { toValue: 1, duration: 1500, useNativeDriver: true }),
            Animated.delay(1500),
            Animated.timing(buttonShimmer, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])).start();
    }, []);

    const glowOpacity = glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] });

    const pills: { icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
        { icon: 'search-outline', label: t.landing.pillScamDetection },
        { icon: 'bar-chart-outline', label: t.landing.pillRiskScore },
        { icon: 'bulb-outline', label: t.landing.pillPreventionTips },
    ];

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/1772616537009.png')}
                style={styles.bg}
                resizeMode="cover"
            >
                {/* Multi-stop gradient overlay */}
                <LinearGradient
                    colors={[
                        'rgba(0,0,0,0.1)',
                        'rgba(44,24,16,0.35)',
                        'rgba(27,67,50,0.5)',
                        'rgba(20,20,20,0.88)',
                        '#0D1A14',
                    ]}
                    locations={[0, 0.2, 0.45, 0.72, 1]}
                    style={styles.gradient}
                >
                    {/* Language Switcher */}
                    <View style={styles.langRow}>
                        <LanguageSwitcher />
                    </View>

                    {/* Floating leaves */}
                    {[...Array(7)].map((_, i) => (
                        <FloatingLeaf
                            key={i}
                            delay={i * 1.3}
                            startX={(width / 7) * i + 10}
                            size={14 + (i % 3) * 6}
                        />
                    ))}

                    {/* Content */}
                    <View style={styles.content}>

                        {/* Main Title */}
                        <Animated.View style={{
                            opacity: glowOpacity,
                            transform: [{ scale: titleScale }],
                        }}>
                            <Animated.Text style={[styles.title, { opacity: titleOpacity, fontFamily: fontsLoaded ? 'Macondo_400Regular' : undefined }]}>
                                Rakshana AI
                            </Animated.Text>
                        </Animated.View>

                        {/* Decorative divider */}
                        <Animated.View style={[styles.divider, { opacity: subtitleOpacity }]}>
                            <View style={styles.dividerLine} />
                            <Ionicons name="leaf-outline" size={20} color={Colors.secondaryLight} style={{ marginHorizontal: 10 }} />
                            <View style={styles.dividerLine} />
                        </Animated.View>

                        {/* Subtitle */}
                        <Animated.Text style={[styles.subtitle, {
                            opacity: subtitleOpacity,
                            transform: [{ translateY: subtitleY }],
                        }]}>
                            {t.landing.subtitle}
                        </Animated.Text>

                        {/* Feature pills */}
                        <Animated.View style={[styles.pillsRow, { opacity: taglineOpacity }]}>
                            {pills.map((pill, i) => (
                                <View key={i} style={styles.pill}>
                                    <Ionicons name={pill.icon} size={12} color={Colors.wheat} style={{ marginRight: 4 }} />
                                    <Text style={styles.pillText}>{pill.label}</Text>
                                </View>
                            ))}
                        </Animated.View>

                        {/* Get Started Button */}
                        <Animated.View style={{
                            opacity: buttonOpacity,
                            transform: [{ scale: buttonScale }],
                        }}>
                            <TouchableOpacity
                                style={styles.button}
                                activeOpacity={0.8}
                                onPress={() => router.push('/login')}
                            >
                                <LinearGradient
                                    colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.buttonGradient}
                                >
                                    <Text style={styles.buttonText}>{t.landing.getStarted}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0D1A14' },
    langRow: { position: 'absolute' as const, top: Platform.OS === 'web' ? 20 : 50, right: 20, zIndex: 10 },
    bg: { flex: 1, width: '100%', height: '100%' },
    gradient: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: Platform.OS === 'web' ? 80 : 60,
        paddingHorizontal: Spacing.xl,
    },
    content: { alignItems: 'center' },

    // Badge
    aiBadge: {
        backgroundColor: 'rgba(82,183,136,0.25)',
        borderWidth: 1,
        borderColor: Colors.secondaryLight,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 6,
        marginBottom: Spacing.m,
    },
    aiBadgeText: {
        color: Colors.secondaryLight,
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 1,
    },

    // Title
    title: {
        fontSize: 52,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 3,
        textShadowColor: Colors.primaryLight,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 30,
    },

    // Divider
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.s,
        width: '70%',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.secondaryLight,
        opacity: 0.5,
    },

    // Subtitle
    subtitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.secondaryLight,
        textAlign: 'center',
        letterSpacing: 1.5,
        marginBottom: Spacing.s,
    },

    // Description
    description: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing.l,
    },

    // Pills
    pillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginBottom: Spacing.xl,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(139,69,19,0.3)',
        borderWidth: 1,
        borderColor: 'rgba(196,114,42,0.5)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 3,
    },
    pillText: {
        color: Colors.wheat,
        fontSize: 12,
        fontWeight: '600',
    },

    // Button
    button: {
        borderRadius: 30,
        overflow: 'hidden',
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 14,
        elevation: 8,
        marginBottom: Spacing.m,
    },
    buttonGradient: {
        paddingVertical: 18,
        paddingHorizontal: 60,
        borderRadius: 30,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '900',
        color: Colors.wheat,
        letterSpacing: 1.5,
    },
    bottomNote: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        textAlign: 'center',
    },
});
