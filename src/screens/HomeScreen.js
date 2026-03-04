// src/screens/HomeScreen.js
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { COLORS, FONTS, TEXT } from '../constants';
import AnalyzeScreen from './AnalyzeScreen';
import AwarenessScreen from './AwarenessScreen';
import HistoryScreen from './HistoryScreen';

const TABS = [
  { key: 'analyze',   te: '🔍 తనిఖీ',   en: 'Analyze' },
  { key: 'awareness', te: '📚 అవగాహన',  en: 'Awareness' },
  { key: 'history',   te: '📋 చరిత్ర',   en: 'History' },
];

export default function HomeScreen({ route }) {
  const initialTab = route?.params?.tab || 'analyze';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [history, setHistory]     = useState([]);

  // Called from AnalyzeScreen when a result is ready
  const addToHistory = (message, result) => {
    setHistory(prev => [
      {
        message: message.slice(0, 80) + (message.length > 80 ? '…' : ''),
        result,
        time: new Date().toLocaleTimeString('te-IN', { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev.slice(0, 19),
    ]);
  };

  const clearHistory = () => setHistory([]);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

      {/* App bar */}
      <View style={styles.appBar}>
        <Text style={styles.appBarIcon}>🛡️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.appBarTitle}>FraudShield.AI</Text>
          <Text style={styles.appBarSub}>మీ డిజిటల్ భద్రత</Text>
        </View>
        <View style={styles.helplineChip}>
          <Text style={styles.helplineChipText}>🆘 1930</Text>
        </View>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.75}
          >
            <Text style={[styles.tabTe, activeTab === tab.key && styles.tabTextActive]}>{tab.te}</Text>
            <Text style={[styles.tabEn, activeTab === tab.key && styles.tabEnActive]}>{tab.en}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Screen content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'analyze'   && <AnalyzeScreen onResult={addToHistory} />}
        {activeTab === 'awareness' && <AwarenessScreen />}
        {activeTab === 'history'   && <HistoryScreen history={history} onClear={clearHistory} />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  appBar: {
    backgroundColor: COLORS.dark,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  appBarIcon: { fontSize: 24 },
  appBarTitle: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.lg, color: '#FFF8EE' },
  appBarSub: { fontFamily: 'HindGuntur-Regular', fontSize: FONTS.xs, color: '#D4956A' },
  helplineChip: { backgroundColor: 'rgba(220,38,38,0.2)', borderWidth: 1, borderColor: 'rgba(220,38,38,0.4)', borderRadius: 10, paddingVertical: 5, paddingHorizontal: 10 },
  helplineChipText: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.sm, color: '#FCA5A5' },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF8EE',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary, backgroundColor: COLORS.surface },
  tabTe: { fontFamily: 'Baloo2-Bold', fontSize: 11, color: COLORS.muted },
  tabEn: { fontFamily: 'DMSans-Regular', fontSize: 9, color: COLORS.dim },
  tabTextActive: { color: COLORS.primary },
  tabEnActive: { color: COLORS.primary + '99' },
});
