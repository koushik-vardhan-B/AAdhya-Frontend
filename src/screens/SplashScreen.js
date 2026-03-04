// src/screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
  SafeAreaView, StatusBar, Dimensions,
} from 'react-native';
import { COLORS, FONTS, TEXT } from '../constants';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const fadeAnim   = useRef(new Animated.Value(0)).current;
  const slideAnim  = useRef(new Animated.Value(40)).current;
  const scaleAnim  = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8,   useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6,   useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

      {/* Background glow */}
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Shield Icon */}
        <Animated.View style={[styles.shieldWrap, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.shieldIcon}>🛡️</Text>
        </Animated.View>

        {/* Brand */}
        <View style={styles.brandRow}>
          <Text style={styles.brandWhite}>FRAUD</Text>
          <Text style={styles.brandOrange}>SHIELD</Text>
        </View>
        <Text style={styles.brandSub}>.AI</Text>

        {/* Tagline */}
        <Text style={styles.taglineTe}>{TEXT.tagline.te}</Text>
        <Text style={styles.taglineEn}>{TEXT.tagline.en}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statVal}>12L+</Text>
            <Text style={styles.statTe}>మోసాలు నిరోధించాం</Text>
            <Text style={styles.statEn}>Scams Blocked</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={[styles.statVal, { color: '#FBBF24' }]}>98%</Text>
            <Text style={styles.statTe}>ఖచ్చితత్వం</Text>
            <Text style={styles.statEn}>Accuracy</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={[styles.statVal, { color: '#4ADE80' }]}>ఉచిత</Text>
            <Text style={styles.statTe}>ఎల్లప్పుడూ</Text>
            <Text style={styles.statEn}>Always Free</Text>
          </View>
        </View>

        {/* CTA Buttons */}
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnTe}>{TEXT.checkBtn.te}</Text>
          <Text style={styles.primaryBtnEn}>{TEXT.checkBtn.en}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ghostBtn}
          onPress={() => navigation.navigate('Home', { tab: 'awareness' })}
          activeOpacity={0.8}
        >
          <Text style={styles.ghostBtnText}>{TEXT.learnBtn.te}</Text>
        </TouchableOpacity>

        {/* Helpline strip */}
        <View style={styles.helpStrip}>
          <Text style={styles.helpIcon}>🆘</Text>
          <View>
            <Text style={styles.helpLabel}>సైబర్ క్రైమ్ హెల్ప్‌లైన్</Text>
            <Text style={styles.helpNum}>1930</Text>
          </View>
        </View>

      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.dark },
  glow1: { position: 'absolute', top: -80, left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(249,115,22,0.08)' },
  glow2: { position: 'absolute', bottom: -60, right: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(251,191,36,0.06)' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 16 },
  shieldWrap: { width: 90, height: 90, borderRadius: 28, backgroundColor: 'rgba(249,115,22,0.15)', borderWidth: 2, borderColor: 'rgba(249,115,22,0.4)', alignItems: 'center', justifyContent: 'center' },
  shieldIcon: { fontSize: 44 },
  brandRow: { flexDirection: 'row', gap: 0 },
  brandWhite: { fontFamily: 'Baloo2-ExtraBold', fontSize: FONTS.xxxl, color: '#FFF8EE', letterSpacing: -1 },
  brandOrange: { fontFamily: 'Baloo2-ExtraBold', fontSize: FONTS.xxxl, color: '#FB923C', letterSpacing: -1 },
  brandSub: { fontFamily: 'HindGuntur-Regular', fontSize: FONTS.lg, color: '#FBBF24', marginTop: -8 },
  taglineTe: { fontFamily: 'HindGuntur-SemiBold', fontSize: FONTS.lg, color: '#FB923C', textAlign: 'center', lineHeight: 24 },
  taglineEn: { fontFamily: 'DMSans-Regular', fontSize: FONTS.xs, color: COLORS.muted, textAlign: 'center', marginTop: -8 },
  statsRow: { flexDirection: 'row', gap: 10, width: '100%', justifyContent: 'center' },
  statChip: { flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)', borderRadius: 14, padding: 12, alignItems: 'center' },
  statVal: { fontFamily: 'Baloo2-ExtraBold', fontSize: FONTS.xl, color: '#FB923C' },
  statTe: { fontFamily: 'HindGuntur-Regular', fontSize: 9, color: '#D4956A', textAlign: 'center', marginTop: 2 },
  statEn: { fontFamily: 'DMSans-Regular', fontSize: 8, color: '#6B5040', textAlign: 'center' },
  primaryBtn: { width: '100%', backgroundColor: COLORS.primary, borderRadius: 18, paddingVertical: 16, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 8 },
  primaryBtnTe: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.lg, color: '#fff' },
  primaryBtnEn: { fontFamily: 'DMSans-Regular', fontSize: FONTS.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  ghostBtn: { width: '100%', backgroundColor: 'rgba(249,115,22,0.08)', borderWidth: 1, borderColor: 'rgba(249,115,22,0.3)', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  ghostBtnText: { fontFamily: 'Baloo2-SemiBold', fontSize: FONTS.md, color: '#FB923C' },
  helpStrip: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(220,38,38,0.12)', borderWidth: 1, borderColor: 'rgba(220,38,38,0.3)', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 16, width: '100%' },
  helpIcon: { fontSize: 22 },
  helpLabel: { fontFamily: 'HindGuntur-SemiBold', fontSize: FONTS.sm, color: '#FCA5A5' },
  helpNum: { fontFamily: 'Baloo2-ExtraBold', fontSize: FONTS.xl, color: '#FCA5A5', letterSpacing: 2 },
});
