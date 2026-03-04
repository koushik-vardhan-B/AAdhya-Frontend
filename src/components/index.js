// src/components/index.js
import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS } from '../constants';

// ─── Bilingual Text ───────────────────────────────────────
export const BiText = ({ te, en, teStyle, enStyle, style }) => (
  <View style={style}>
    <Text style={[styles.teText, teStyle]}>{te}</Text>
    {en ? <Text style={[styles.enText, enStyle]}>{en}</Text> : null}
  </View>
);

// ─── Risk Badge ───────────────────────────────────────────
export const RiskBadge = ({ risk, score }) => {
  const cfg = {
    'Safe':      { bg: COLORS.safeBg,   border: COLORS.safeBorder,  text: COLORS.safe,   dot: COLORS.safe },
    'Suspicious':{ bg: COLORS.warnBg,   border: COLORS.warnBorder,  text: COLORS.warn,   dot: COLORS.warn },
    'High Risk': { bg: COLORS.dangerBg, border: COLORS.dangerBorder, text: COLORS.danger, dot: COLORS.danger },
  }[risk] || {};

  const teLabel = { 'Safe': 'సురక్షితం', 'Suspicious': 'అనుమానాస్పదం', 'High Risk': 'అధిక ప్రమాదం' }[risk];

  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
      <View style={[styles.badgeDot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.badgeText, { color: cfg.text }]}>{teLabel} · {risk}</Text>
    </View>
  );
};

// ─── Score Gauge (circular) ───────────────────────────────
export const ScoreGauge = ({ score }) => {
  const color = score <= 30 ? COLORS.safe : score <= 65 ? COLORS.warn : COLORS.danger;
  return (
    <View style={[styles.gaugeOuter, { borderColor: color + '40' }]}>
      <View style={[styles.gaugeInner, { borderColor: color }]}>
        <Text style={[styles.gaugeNum, { color }]}>{score}</Text>
        <Text style={styles.gaugeSub}>/ 100</Text>
      </View>
    </View>
  );
};

// ─── Primary Button ───────────────────────────────────────
export const PrimaryButton = ({ teLabel, enLabel, onPress, loading, style }) => (
  <TouchableOpacity
    style={[styles.primaryBtn, style]}
    onPress={onPress}
    disabled={loading}
    activeOpacity={0.85}
  >
    {loading
      ? <ActivityIndicator color="#fff" />
      : <>
          <Text style={styles.primaryBtnTe}>{teLabel}</Text>
          {enLabel ? <Text style={styles.primaryBtnEn}>{enLabel}</Text> : null}
        </>
    }
  </TouchableOpacity>
);

// ─── Section Header ───────────────────────────────────────
export const SectionHeader = ({ te, en, color = COLORS.primary }) => (
  <View style={styles.sectionHd}>
    <Text style={[styles.sectionTe, { color }]}>{te}</Text>
    {en ? <Text style={styles.sectionEn}>{en}</Text> : null}
  </View>
);

// ─── Keyword Tag ─────────────────────────────────────────
export const KeywordTag = ({ word }) => (
  <View style={styles.kwTag}>
    <Text style={styles.kwText}>{word}</Text>
  </View>
);

// ─── Tip Item ─────────────────────────────────────────────
export const TipItem = ({ index, te, en }) => (
  <View style={styles.tipRow}>
    <View style={styles.tipNum}>
      <Text style={styles.tipNumText}>{index}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.tipTe}>{te}</Text>
      {en ? <Text style={styles.tipEn}>{en}</Text> : null}
    </View>
  </View>
);

// ─── Helpline Bar ─────────────────────────────────────────
export const HelplineBar = () => (
  <View style={styles.helpline}>
    <Text style={styles.helplineIcon}>🆘</Text>
    <View style={{ flex: 1 }}>
      <Text style={styles.helplineTe}>సైబర్ క్రైమ్ హెల్ప్‌లైన్</Text>
      <Text style={styles.helplineNum}>1930</Text>
      <Text style={styles.helplineEn}>Cybercrime Helpline · 24/7</Text>
    </View>
    <View>
      <Text style={styles.helplinePortalLbl}>వెబ్‌సైట్</Text>
      <Text style={styles.helplinePortal}>cybercrime.gov.in</Text>
    </View>
  </View>
);

// ─── Red Flag Item ────────────────────────────────────────
export const RedFlagItem = ({ te, en }) => (
  <View style={styles.rfRow}>
    <Text style={styles.rfBullet}>▶</Text>
    <View style={{ flex: 1 }}>
      <Text style={styles.rfTe}>{te}</Text>
      {en ? <Text style={styles.rfEn}>{en}</Text> : null}
    </View>
  </View>
);

// ─── Fraud Type Chip ──────────────────────────────────────
export const FraudTypeChip = ({ icon, te, en, color }) => (
  <View style={[styles.fraudChip, { backgroundColor: color + '18', borderColor: color + '50' }]}>
    <Text style={styles.fraudChipIcon}>{icon}</Text>
    <View>
      <Text style={[styles.fraudChipTe, { color }]}>{te}</Text>
      <Text style={styles.fraudChipEn}>{en}</Text>
    </View>
  </View>
);

// ─── Styles ───────────────────────────────────────────────
const styles = StyleSheet.create({
  teText: { fontFamily: 'HindGuntur-SemiBold', fontSize: FONTS.md, color: COLORS.text, lineHeight: 22 },
  enText: { fontFamily: 'DMSans-Regular', fontSize: FONTS.xs, color: COLORS.muted, lineHeight: 16, marginTop: 1 },

  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 100, paddingVertical: 4, paddingHorizontal: 12, alignSelf: 'flex-start' },
  badgeDot: { width: 7, height: 7, borderRadius: 4 },
  badgeText: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.xs, letterSpacing: 0.5 },

  gaugeOuter: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  gaugeInner: { width: 64, height: 64, borderRadius: 32, borderWidth: 3, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.surface },
  gaugeNum: { fontFamily: 'Baloo2-ExtraBold', fontSize: FONTS.xl, lineHeight: 24 },
  gaugeSub: { fontFamily: 'DMSans-Regular', fontSize: 8, color: COLORS.muted },

  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 15, paddingHorizontal: 24, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
  primaryBtnTe: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.lg, color: '#fff' },
  primaryBtnEn: { fontFamily: 'DMSans-Regular', fontSize: FONTS.xs, color: 'rgba(255,255,255,0.75)', marginTop: 2 },

  sectionHd: { marginBottom: 10 },
  sectionTe: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.md, letterSpacing: 0.3 },
  sectionEn: { fontFamily: 'DMSans-Regular', fontSize: FONTS.xs, color: COLORS.muted, marginTop: 1 },

  kwTag: { backgroundColor: COLORS.dangerBg, borderWidth: 1, borderColor: COLORS.dangerBorder, borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10 },
  kwText: { fontFamily: 'Baloo2-SemiBold', fontSize: FONTS.sm, color: COLORS.danger },

  tipRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 10 },
  tipNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.safeBg, borderWidth: 1, borderColor: COLORS.safeBorder, alignItems: 'center', justifyContent: 'center' },
  tipNumText: { fontFamily: 'Baloo2-Bold', fontSize: 10, color: COLORS.safe },
  tipTe: { fontFamily: 'HindGuntur-SemiBold', fontSize: FONTS.sm, color: '#14532D', lineHeight: 18 },
  tipEn: { fontFamily: 'DMSans-Regular', fontSize: FONTS.xs, color: COLORS.dim, lineHeight: 15, marginTop: 2 },

  helpline: { backgroundColor: COLORS.dark, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 14 },
  helplineIcon: { fontSize: 28 },
  helplineTe: { fontFamily: 'Baloo2-SemiBold', fontSize: FONTS.sm, color: '#FB923C' },
  helplineNum: { fontFamily: 'Baloo2-ExtraBold', fontSize: FONTS.xxl, color: '#FBBF24', letterSpacing: 2 },
  helplineEn: { fontFamily: 'DMSans-Regular', fontSize: 9, color: COLORS.muted },
  helplinePortalLbl: { fontFamily: 'DMSans-Regular', fontSize: 9, color: COLORS.muted, textAlign: 'right' },
  helplinePortal: { fontFamily: 'Baloo2-SemiBold', fontSize: FONTS.xs, color: '#818CF8', textAlign: 'right' },

  rfRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginBottom: 8 },
  rfBullet: { color: COLORS.danger, fontSize: 10, marginTop: 3 },
  rfTe: { fontFamily: 'HindGuntur-SemiBold', fontSize: FONTS.sm, color: '#7F1D1D', lineHeight: 18 },
  rfEn: { fontFamily: 'DMSans-Regular', fontSize: FONTS.xs, color: COLORS.dim, lineHeight: 15, marginTop: 1 },

  fraudChip: { flexDirection: 'row', gap: 8, alignItems: 'center', borderWidth: 1, borderRadius: 10, paddingVertical: 6, paddingHorizontal: 12, alignSelf: 'flex-start' },
  fraudChipIcon: { fontSize: 18 },
  fraudChipTe: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.sm },
  fraudChipEn: { fontFamily: 'DMSans-Regular', fontSize: 9, color: COLORS.dim },
});
