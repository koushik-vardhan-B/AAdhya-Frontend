// src/screens/HistoryScreen.js
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { COLORS, FONTS, FRAUD_TYPES } from '../constants';

// In production, use AsyncStorage or a state management solution
// For demo, using a simple in-memory store via props/context
export default function HistoryScreen({ history = [], onClear }) {

  const total   = history.length;
  const scams   = history.filter(h => h.result.risk === 'High Risk').length;
  const safe    = history.filter(h => h.result.risk === 'Safe').length;
  const suspicious = history.filter(h => h.result.risk === 'Suspicious').length;
  const riskRate = total ? Math.round((scams + suspicious) / total * 100) : 0;

  const riskCfg = {
    'Safe':      { bg: COLORS.safeBg,   border: COLORS.safeBorder,  text: COLORS.safe,   te: 'సురక్షితం' },
    'Suspicious':{ bg: COLORS.warnBg,   border: COLORS.warnBorder,  text: COLORS.warn,   te: 'అనుమానాస్పదం' },
    'High Risk': { bg: COLORS.dangerBg, border: COLORS.dangerBorder, text: COLORS.danger, te: 'అధిక ప్రమాదం' },
  };

  const confirmClear = () => {
    Alert.alert(
      'చరిత్ర తొలగించండి / Clear History',
      'మొత్తం చరిత్ర తొలగించాలా?\nDelete all analysis history?',
      [{ text: 'రద్దు / Cancel', style: 'cancel' }, { text: 'తొలగించు / Delete', style: 'destructive', onPress: onClear }]
    );
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scroll}>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderTopColor: COLORS.danger }]}>
          <Text style={[styles.statVal, { color: COLORS.danger }]}>{scams}</Text>
          <Text style={styles.statTe}>మోసాలు పట్టుకున్నాం</Text>
          <Text style={styles.statEn}>Scams Caught</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: COLORS.safe }]}>
          <Text style={[styles.statVal, { color: COLORS.safe }]}>{safe}</Text>
          <Text style={styles.statTe}>సురక్షిత మెసేజ్‌లు</Text>
          <Text style={styles.statEn}>Safe Messages</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: COLORS.primary }]}>
          <Text style={[styles.statVal, { color: COLORS.primary }]}>{total}</Text>
          <Text style={styles.statTe}>మొత్తం తనిఖీలు</Text>
          <Text style={styles.statEn}>Total Checked</Text>
        </View>
        <View style={[styles.statCard, { borderTopColor: '#7C3AED' }]}>
          <Text style={[styles.statVal, { color: '#7C3AED' }]}>{riskRate}%</Text>
          <Text style={styles.statTe}>ప్రమాద రేటు</Text>
          <Text style={styles.statEn}>Risk Rate</Text>
        </View>
      </View>

      {/* Header row */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>తాజా తనిఖీలు / Recent Checks</Text>
        {total > 0 && (
          <TouchableOpacity onPress={confirmClear}>
            <Text style={styles.clearBtn}>తొలగించు / Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Empty state */}
      {total === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTe}>ఇంకా తనిఖీలు లేవు</Text>
          <Text style={styles.emptyEn}>No analyses yet. Start by checking a message!</Text>
        </View>
      )}

      {/* History list */}
      {history.map((item, i) => {
        const cfg = riskCfg[item.result.risk] || {};
        const ft  = FRAUD_TYPES[item.result.fraudType] || FRAUD_TYPES['Other'];
        return (
          <View key={i} style={[styles.historyCard, { borderLeftColor: cfg.text, borderLeftWidth: 4 }]}>
            <View style={styles.historyTop}>
              <Text style={styles.historyIcon}>{ft.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyMsg} numberOfLines={2}>{item.message}</Text>
                <Text style={styles.historyTime}>{item.time}</Text>
              </View>
              <View style={[styles.historyBadge, { backgroundColor: cfg.bg, borderColor: cfg.border }]}>
                <Text style={[styles.historyBadgeTe, { color: cfg.text }]}>{cfg.te}</Text>
              </View>
            </View>
            <View style={styles.historyBottom}>
              <View style={[styles.scoreChip, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.scoreChipText, { color: cfg.text }]}>స్కోర్: {item.result.score}/100</Text>
              </View>
              <Text style={styles.fraudTypeTe}>{ft.te} · {item.result.fraudType}</Text>
            </View>
          </View>
        );
      })}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16, paddingBottom: 40, gap: 12 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { flex: 1, minWidth: '45%', backgroundColor: COLORS.surface, borderRadius: 16, padding: 14, alignItems: 'center', borderTopWidth: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  statVal: { fontFamily: 'Baloo2-ExtraBold', fontSize: 30, lineHeight: 36 },
  statTe: { fontFamily: 'HindGuntur-SemiBold', fontSize: FONTS.sm, color: COLORS.textMid, textAlign: 'center', marginTop: 2 },
  statEn: { fontFamily: 'DMSans-Regular', fontSize: 9, color: COLORS.muted, textAlign: 'center' },

  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  listTitle: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.md, color: COLORS.text },
  clearBtn: { fontFamily: 'DMSans-Regular', fontSize: FONTS.xs, color: COLORS.danger },

  emptyState: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 40, alignItems: 'center', gap: 8 },
  emptyIcon: { fontSize: 44 },
  emptyTe: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.lg, color: COLORS.textMid },
  emptyEn: { fontFamily: 'DMSans-Regular', fontSize: FONTS.sm, color: COLORS.muted, textAlign: 'center' },

  historyCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  historyTop: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 8 },
  historyIcon: { fontSize: 20 },
  historyMsg: { fontFamily: 'HindGuntur-Regular', fontSize: FONTS.sm, color: COLORS.textMid, lineHeight: 18, flex: 1 },
  historyTime: { fontFamily: 'DMSans-Regular', fontSize: 9, color: COLORS.dim, marginTop: 3 },
  historyBadge: { borderWidth: 1, borderRadius: 100, paddingVertical: 3, paddingHorizontal: 8 },
  historyBadgeTe: { fontFamily: 'Baloo2-Bold', fontSize: 9 },
  historyBottom: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  scoreChip: { borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  scoreChipText: { fontFamily: 'Baloo2-SemiBold', fontSize: 10 },
  fraudTypeTe: { fontFamily: 'DMSans-Regular', fontSize: 9, color: COLORS.muted, flex: 1 },
});
