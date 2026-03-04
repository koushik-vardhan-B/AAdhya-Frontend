// src/screens/AwarenessScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS } from '../constants';

const FRAUD_CARDS = [
  {
    icon: '💸', color: COLORS.danger,
    te: 'UPI మోసం', en: 'UPI Fraud',
    signs: [
      { te: 'UPI PIN అడుగుతోంది', en: 'Asking for your UPI PIN' },
      { te: 'డబ్బు పంపి వాపస్ అడుగుతోంది', en: 'Sends money then asks for return' },
      { te: 'తెలియని QR కోడ్ స్కాన్ అడుగుతోంది', en: 'Unknown QR code scan request' },
    ],
    tip: { te: 'UPI PIN ఎవరికీ చెప్పకండి! బ్యాంక్ ఎప్పుడూ అడగదు.', en: 'Never share your UPI PIN. Banks never ask for it.' },
  },
  {
    icon: '🎰', color: COLORS.warn,
    te: 'లాటరీ మోసం', en: 'Lottery Scam',
    signs: [
      { te: 'పాల్గొనకుండానే గెలుపు చెప్తోంది', en: 'Claims you won without entering' },
      { te: 'ఫీజు కట్టమని అడుగుతోంది', en: 'Asks for fee to claim prize' },
      { te: 'అసాధారణ బహుమతి మొత్తాలు', en: 'Unrealistic prize amounts' },
    ],
    tip: { te: 'అసలైన లాటరీ ఎప్పుడూ ఫీజు అడగదు!', en: 'Real lotteries never ask you to pay to win.' },
  },
  {
    icon: '💼', color: '#7C3AED',
    te: 'నకిలీ ఉద్యోగం', en: 'Job Scam',
    signs: [
      { te: 'అనుభవం లేకుండా లక్ష జీతం!', en: 'High salary with no experience needed' },
      { te: 'రిజిస్ట్రేషన్ ఫీజు కట్టమని', en: 'Asks for registration fee upfront' },
      { te: 'వర్క్ ఫ్రమ్ హోమ్ అనూహ్య ఆదాయం', en: 'Work from home unrealistic earnings' },
    ],
    tip: { te: 'నిజమైన కంపెనీలు ఉద్యోగానికి ఫీజు అడగవు!', en: 'Legitimate employers never ask you to pay.' },
  },
  {
    icon: '🎣', color: COLORS.info,
    te: 'ఫిషింగ్ మోసం', en: 'Phishing',
    signs: [
      { te: 'బ్యాంక్ అకౌంట్ బ్లాక్ అవుతుందని భయపెట్టడం', en: 'Threatens account suspension urgently' },
      { te: 'అసలైన వెబ్‌సైట్ లాగా ఉండే నకిలీ లింక్', en: 'Fake links mimicking real websites' },
      { te: 'OTP, ఆధార్ నంబర్ అడగడం', en: 'Asks for OTP, Aadhaar or password' },
    ],
    tip: { te: 'తెలియని లింక్‌లు క్లిక్ చేయకండి. నేరుగా వెబ్‌సైట్ తెరవండి.', en: 'Never click unknown links. Type website addresses manually.' },
  },
  {
    icon: '🎭', color: '#059669',
    te: 'నకిలీ వ్యక్తి మోసం', en: 'Impersonation Fraud',
    signs: [
      { te: 'పోలీస్ / CBI / IT అని చెప్పడం', en: 'Impersonating Police / CBI / IT officers' },
      { te: 'చట్టపరమైన చర్యలు తీసుకుంటామని భయపెట్టడం', en: 'Threatens legal action urgently' },
      { te: 'పేటీఎం / BHIM / NPCI అని చెప్పడం', en: 'Pretends to be from PayTM/BHIM/NPCI' },
    ],
    tip: { te: 'అధికారులు ఎప్పుడూ ఫోన్‌లో డబ్బు అడగరు!', en: 'Authorities never demand money over phone.' },
  },
];

const CONTACTS = [
  { te: 'సైబర్ క్రైమ్ హెల్ప్‌లైన్', en: 'Cyber Crime Helpline', num: '1930' },
  { te: 'పోలీస్ అత్యవసర', en: 'Police Emergency', num: '100' },
  { te: 'మహిళా హెల్ప్‌లైన్', en: 'Women Helpline', num: '181' },
  { te: 'NPCI UPI వివాదాలు', en: 'NPCI UPI Disputes', num: '1800-120-1740' },
];

export default function AwarenessScreen() {
  const [expanded, setExpanded] = useState(null);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scroll}>

      <Text style={styles.pageTitle}>📚 మోసాల రకాలు తెలుసుకోండి</Text>
      <Text style={styles.pageSub}>Know the Scam Types</Text>

      {FRAUD_CARDS.map((card, i) => {
        const isOpen = expanded === i;
        return (
          <TouchableOpacity
            key={i}
            style={[styles.card, { borderLeftColor: card.color }]}
            onPress={() => setExpanded(isOpen ? null : i)}
            activeOpacity={0.85}
          >
            <View style={styles.cardHead}>
              <Text style={styles.cardIcon}>{card.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitleTe, { color: card.color }]}>{card.te}</Text>
                <Text style={styles.cardTitleEn}>{card.en}</Text>
              </View>
              <Text style={[styles.chevron, { color: card.color }]}>{isOpen ? '▲' : '▼'}</Text>
            </View>

            {isOpen && (
              <View style={styles.cardBody}>
                <View style={styles.divider} />
                <Text style={styles.signsTitle}>⚠️ గుర్తింపు సంకేతాలు / Warning Signs:</Text>
                {card.signs.map((s, j) => (
                  <View key={j} style={styles.signRow}>
                    <Text style={[styles.signBullet, { color: card.color }]}>•</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.signTe}>{s.te}</Text>
                      <Text style={styles.signEn}>{s.en}</Text>
                    </View>
                  </View>
                ))}
                <View style={styles.tipBox}>
                  <Text style={styles.tipTe}>✅ {card.tip.te}</Text>
                  <Text style={styles.tipEn}>{card.tip.en}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      {/* Emergency contacts */}
      <View style={styles.contactCard}>
        <Text style={styles.contactTitle}>🆘 అత్యవసర నంబర్లు / Emergency Contacts</Text>
        {CONTACTS.map((c, i) => (
          <View key={i} style={[styles.contactRow, i < CONTACTS.length - 1 && styles.contactRowBorder]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactTe}>{c.te}</Text>
              <Text style={styles.contactEn}>{c.en}</Text>
            </View>
            <Text style={styles.contactNum}>{c.num}</Text>
          </View>
        ))}
      </View>

      {/* Digital safety tips */}
      <View style={styles.safetyCard}>
        <Text style={styles.safetyTitle}>🛡️ డిజిటల్ భద్రత చిట్కాలు</Text>
        <Text style={styles.safetySubtitle}>Digital Safety Tips</Text>
        {[
          { te: 'తెలియని లింక్‌లు క్లిక్ చేయకండి', en: 'Never click on unknown links' },
          { te: 'OTP, PIN ఎవరికీ చెప్పకండి', en: 'Never share OTP or PIN with anyone' },
          { te: 'అనుమానం వస్తే 1930 కి కాల్ చేయండి', en: 'When in doubt, call 1930 immediately' },
          { te: 'నకిలీ యాప్‌లు డౌన్‌లోడ్ చేయకండి', en: 'Only download apps from official stores' },
          { te: 'UPI లావాదేవీలు రెండుసార్లు తనిఖీ చేయండి', en: 'Always double-check UPI transactions' },
        ].map((tip, i) => (
          <View key={i} style={styles.safetyTipRow}>
            <View style={styles.safetyTipNum}><Text style={styles.safetyTipNumText}>{i + 1}</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.safetyTipTe}>{tip.te}</Text>
              <Text style={styles.safetyTipEn}>{tip.en}</Text>
            </View>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: 16, paddingBottom: 40, gap: 12 },
  pageTitle: { fontFamily: 'Baloo2-ExtraBold', fontSize: FONTS.xl, color: COLORS.text },
  pageSub: { fontFamily: 'DMSans-Regular', fontSize: FONTS.sm, color: COLORS.muted, marginBottom: 4 },

  card: { backgroundColor: COLORS.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', borderLeftWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIcon: { fontSize: 22 },
  cardTitleTe: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.md },
  cardTitleEn: { fontFamily: 'DMSans-Regular', fontSize: FONTS.xs, color: COLORS.muted },
  chevron: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.sm },

  cardBody: { marginTop: 10 },
  divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginBottom: 10 },
  signsTitle: { fontFamily: 'Baloo2-SemiBold', fontSize: FONTS.xs, color: COLORS.muted, marginBottom: 8, letterSpacing: 0.3 },
  signRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginBottom: 7 },
  signBullet: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.md, marginTop: 1 },
  signTe: { fontFamily: 'HindGuntur-SemiBold', fontSize: FONTS.sm, color: COLORS.textMid, lineHeight: 18 },
  signEn: { fontFamily: 'DMSans-Regular', fontSize: 9, color: COLORS.dim, lineHeight: 14, marginTop: 1 },
  tipBox: { backgroundColor: '#F0FDF4', borderRadius: 10, padding: 10, marginTop: 8 },
  tipTe: { fontFamily: 'HindGuntur-Bold', fontSize: FONTS.sm, color: '#14532D', lineHeight: 18 },
  tipEn: { fontFamily: 'DMSans-Regular', fontSize: 9, color: '#4ADE80', marginTop: 3 },

  contactCard: { backgroundColor: COLORS.dark, borderRadius: 18, padding: 16 },
  contactTitle: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.md, color: '#FB923C', marginBottom: 12 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  contactRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  contactTe: { fontFamily: 'HindGuntur-SemiBold', fontSize: FONTS.sm, color: '#D4956A' },
  contactEn: { fontFamily: 'DMSans-Regular', fontSize: 9, color: '#6B5040' },
  contactNum: { fontFamily: 'Baloo2-ExtraBold', fontSize: FONTS.lg, color: '#FBBF24', letterSpacing: 1 },

  safetyCard: { backgroundColor: '#FFF8EE', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: 'rgba(249,115,22,0.15)' },
  safetyTitle: { fontFamily: 'Baloo2-Bold', fontSize: FONTS.md, color: '#92400E' },
  safetySubtitle: { fontFamily: 'DMSans-Regular', fontSize: FONTS.xs, color: COLORS.muted, marginBottom: 12 },
  safetyTipRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 10 },
  safetyTipNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(249,115,22,0.15)', borderWidth: 1, borderColor: 'rgba(249,115,22,0.3)', alignItems: 'center', justifyContent: 'center' },
  safetyTipNumText: { fontFamily: 'Baloo2-Bold', fontSize: 11, color: COLORS.primary },
  safetyTipTe: { fontFamily: 'HindGuntur-SemiBold', fontSize: FONTS.sm, color: COLORS.textMid, lineHeight: 18 },
  safetyTipEn: { fontFamily: 'DMSans-Regular', fontSize: 9, color: COLORS.dim, lineHeight: 14, marginTop: 2 },
});
