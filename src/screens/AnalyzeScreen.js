// src/screens/AnalyzeScreen.js
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Animated, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { COLORS, FONTS, TEXT, SAMPLES, FRAUD_TYPES } from '../constants';
import {
  RiskBadge, ScoreGauge, SectionHeader, KeywordTag,
  TipItem, HelplineBar, RedFlagItem, FraudTypeChip,
} from '../components';
import { analyzeMessage } from '../services/fraudAnalysis';

export default function AnalyzeScreen() {
  const [message, setMessage]   = useState('');
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const resultAnim = useRef(new Animated.Value(0)).current;

  const analyze = async () => {
    if (!message.trim()) {
      Alert.alert('మెసేజ్ లేదు', 'దయచేసి ఒక మెసేజ్ అతికించండి.\nPlease paste a message first.');
      return;
    }
    setLoading(true);
    setResult(null);
    resultAnim.setValue(0);
    try {
      const data = await analyzeMessage(message);
      setResult(data);
      Animated.spring(resultAnim, { toValue: 1, friction: 7, useNativeDriver: true }).start();
    } catch {
      Alert.alert('లోపం / Error', 'విశ్లేషణ విఫలమైంది. మళ్ళీ ప్రయత్నించండి.\nAnalysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const riskColors = {
    'Safe':      { bg: COLORS.safeBg,   border: COLORS.safeBorder,  text: COLORS.safe },
    'Suspicious':{ bg: COLORS.warnBg,   border: COLORS.warnBorder,  text: COLORS.warn },
    'High Risk': { bg: COLORS.dangerBg, border: COLORS.dangerBorder, text: COLORS.danger },
  };
  const rc = result ? riskColors[result.risk] || {} : {};
  const ft = result ? (FRAUD_TYPES[result.fraudType] || FRAUD_TYPES['Other']) : null;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.root} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Input card */}
        <View style={styles.card}>
          <SectionHeader te="📩 మీ SMS / మెసేజ్ అతికించండి" en="Paste your suspicious message" color={COLORS.primary} />
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={5}
            placeholder={`${TEXT.pastePlaceholder.te}\n${TEXT.pastePlaceholder.en}`}
            placeholderTextColor={COLORS.dim}
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{message.length} అక్షరాలు / characters</Text>

          {/* Sample chips */}
          <Text style={styles.sampleLabel}>🧪 నమూనాలు / Try Samples:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.samplesScroll}>
            {SAMPLES.map((s, i) => (
              <TouchableOpacity key={i} style={styles.sampleChip} onPress={() => setMessage(s.msg)} activeOpacity={0.75}>
                <Text style={styles.sampleTe}>{s.label.te}</Text>
                <Text style={styles.sampleEn}>{s.label.en}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Analyze button */}
          <TouchableOpacity
            style={[styles.analyzeBtn, (!message.trim() || loading) && styles.analyzeBtnDisabled]}
            onPress={analyze}
            disabled={!message.trim() || loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <>
                  <Text style={styles.analyzeBtnTe}>{TEXT.analyzeBtn.te}</Text>
                  <Text style={styles.analyzeBtnEn}>{TEXT.analyzeBtn.en}</Text>
                </>
            }
          </TouchableOpacity>

          {/* Safety tip */}
          <View style={styles.tipStrip}>
            <Text>💡</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.tipStripTe}>మీ OTP, PIN ఎవరికీ చెప్పకండి</Text>
              <Text style={styles.tipStripEn}>Never share your OTP or PIN with anyone</Text>
            </View>
          </View>
        </View>

        {/* Loading state */}
        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingTe}>AI విశ్లేషిస్తోంది…</Text>
            <Text style={styles.loadingEn}>Scanning threat patterns…</Text>
          </View>
        )}

        {/* ── Result ── */}
        {result && !loading && (
          <Animated.View style={{ opacity: resultAnim, transform: [{ translateY: resultAnim.interpolate({ inputRange: [0,1], outputRange: [20,0] }) }] }}>

            {/* Risk banner */}
            <View style={[styles.riskBanner, { backgroundColor: rc.bg, borderColor: rc.border }]}>
              <ScoreGauge score={result.score} />
              <View style={{ flex: 1 }}>
                <RiskBadge risk={result.risk} />
                <View style={styles.fraudTypeRow}>
                  {ft && <FraudTypeChip icon={ft.icon} te={ft.te} en={result.fraudType} color={ft.color} />}
                </View>
                <Text style={styles.explanationTe}>{result.explanationTe}</Text>
                <Text style={styles.explanationEn}>{result.explanation}</Text>
              </View>
            </View>

            {/* Red Flags */}
            {result.redFlags?.length > 0 && (
              <View style={styles.card}>
                <SectionHeader te={TEXT.redFlags.te} en={TEXT.redFlags.en} color={COLORS.danger} />
                {result.redFlags.map((flag, i) => (
                  <RedFlagItem key={i} te={result.redFlagsTe?.[i] || flag} en={flag} />
                ))}
              </View>
            )}

            {/* Keywords */}
            {result.suspiciousKeywords?.length > 0 && (
              <View style={styles.card}>
                <SectionHeader te={TEXT.keywords.te} en={TEXT.keywords.en} color={COLORS.warn} />
                <View style={styles.kwWrap}>
                  {result.suspiciousKeywords.map((kw, i) => <KeywordTag key={i} word={kw} />)}
                </View>
              </View>
            )}

            {/* Safety Tips */}
            <View style={[styles.card, styles.tipsCard]}>
              <SectionHeader te={TEXT.safetyTips.te} en={TEXT.safetyTips.en} color={COLORS.safe} />
              {(result.tipsTe || result.tips)?.map((tip, i) => (
                <TipItem key={i} index={i + 1} te={result.tipsTe?.[i] || tip} en={result.tips?.[i]} />
              ))}
            </View>

            {/* Helpline */}
            <View style={styles.card}>
              <HelplineBar />
            </View>

          </Animated.View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16, paddingBottom: 40, gap: 12 },

  card: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 18, borderWidth: 1, borderColor: COLORS.border || 'rgba(0,0,0,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },

  input: { backgroundColor: '#FFF8EE', borderWidth: 2, borderColor: 'rgba(249,115,22,0.25)', borderRadius: 16, padding: 14, fontSize: FONTS.md, color: COLORS.textMid, fontFamily: 'HindGuntur-Regular', minHeight: 110, marginBottom: 6 },
  charCount: { fontFamily: 'DMSans-Regular', fontSize: FONTS.xs, color: COLORS.muted, textAlign: 'right', marginBottom: 12 },

  sampleLabel: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.xs, color: '#92400E', marginBottom: 8, letterSpacing: 0.5 },
  samplesScroll: { marginBottom: 14 },
  sampleChip: { backgroundColor: '#FFF8EE', borderWidth: 1, borderColor: 'rgba(249,115,22,0.25)', borderRadius: 10, paddingVertical: 7, paddingHorizontal: 12, marginRight: 8 },
  sampleTe: { fontFamily: 'HindGuntur-SemiBold', fontSize: FONTS.sm, color: '#92400E' },
  sampleEn: { fontFamily: 'DMSans-Regular', fontSize: 9, color: COLORS.muted },

  analyzeBtn: { backgroundColor: COLORS.primary, borderRadius: 16, paddingVertical: 15, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  analyzeBtnDisabled: { backgroundColor: '#D4956A', shadowOpacity: 0 },
  analyzeBtnTe: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.lg, color: '#fff' },
  analyzeBtnEn: { fontFamily: 'DMSans-Regular', fontSize: FONTS.xs, color: 'rgba(255,255,255,0.72)', marginTop: 2 },

  tipStrip: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 12, padding: 10, marginTop: 12 },
  tipStripTe: { fontFamily: 'HindGuntur-SemiBold', fontSize: FONTS.sm, color: '#14532D' },
  tipStripEn: { fontFamily: 'DMSans-Regular', fontSize: 9, color: '#4ADE80', marginTop: 2 },

  loadingCard: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 32, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(249,115,22,0.2)' },
  loadingTe: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.lg, color: '#92400E' },
  loadingEn: { fontFamily: 'DMSans-Regular', fontSize: FONTS.sm, color: COLORS.muted },

  riskBanner: { borderRadius: 20, borderWidth: 2, padding: 18, flexDirection: 'row', gap: 14, alignItems: 'flex-start', marginBottom: 12 },
  fraudTypeRow: { marginVertical: 6 },
  explanationTe: { fontFamily: 'HindGuntur-SemiBold', fontSize: FONTS.sm, color: COLORS.textMid, lineHeight: 19, marginTop: 4 },
  explanationEn: { fontFamily: 'DMSans-Regular', fontSize: FONTS.xs, color: COLORS.muted, lineHeight: 16, marginTop: 3 },

  kwWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  tipsCard: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' },
});
