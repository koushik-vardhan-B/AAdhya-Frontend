import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator, Modal, RefreshControl, ScrollView,
    StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { getScanById, getScans, ScanDetail, ScanItem } from '../services/api';

export default function HistoryScreen() {
    const { t } = useLanguage();
    const [scans, setScans] = useState<ScanItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedScan, setSelectedScan] = useState<ScanDetail | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchScans = useCallback(async () => {
        try {
            const data = await getScans(30);
            setScans(data);
        } catch {
            // silent
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchScans(); }, [fetchScans]);
    const onRefresh = () => { setRefreshing(true); fetchScans(); };

    const openDetail = async (scanId: string) => {
        setDetailLoading(true);
        setModalVisible(true);
        try {
            const detail = await getScanById(scanId);
            setSelectedScan(detail);
        } catch {
            setSelectedScan(null);
        } finally {
            setDetailLoading(false);
        }
    };

    const getRiskColor = (level: string) => {
        if (level === 'Safe') return Colors.safe;
        if (level === 'Suspicious') return Colors.suspicious;
        return Colors.danger;
    };

    const formatTime = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch { return dateStr; }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <LinearGradient colors={[Colors.backgroundDark, Colors.background, '#fff8e7']} style={styles.gradBg}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <LinearGradient colors={[Colors.primaryLight, Colors.primary]} style={styles.iconBadge}>
                        <Ionicons name="time-outline" size={28} color={Colors.wheat} />
                    </LinearGradient>
                    <Text style={styles.title}>{t.history.title}</Text>
                </View>

                {/* Scan List */}
                {scans.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
                        <Text style={styles.emptyText}>{t.history.noScans}</Text>
                    </View>
                ) : (
                    scans.map((scan) => {
                        const riskColor = getRiskColor(scan.risk_level);
                        return (
                            <TouchableOpacity
                                key={scan.id}
                                style={styles.scanCard}
                                onPress={() => openDetail(scan.id)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.scanTop}>
                                    <View style={[styles.riskBadge, { backgroundColor: riskColor + '20', borderColor: riskColor }]}>
                                        <Text style={[styles.riskText, { color: riskColor }]}>{scan.risk_level}</Text>
                                    </View>
                                    {scan.fraud_type && (
                                        <Text style={styles.fraudType}>{scan.fraud_type}</Text>
                                    )}
                                    <Text style={styles.probability}>{scan.scam_probability}%</Text>
                                </View>
                                <Text style={styles.messagePreview} numberOfLines={2}>{scan.message_preview}</Text>
                                <View style={styles.scanBottom}>
                                    <Text style={styles.timeText}>
                                        <Ionicons name="time-outline" size={12} color={Colors.textMuted} /> {formatTime(scan.created_at)}
                                    </Text>
                                    <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                                </View>
                            </TouchableOpacity>
                        );
                    })
                )}
            </ScrollView>

            {/* Detail Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t.history.viewDetail}</Text>
                            <TouchableOpacity onPress={() => { setModalVisible(false); setSelectedScan(null); }}>
                                <Ionicons name="close-circle" size={28} color={Colors.textMuted} />
                            </TouchableOpacity>
                        </View>

                        {detailLoading ? (
                            <ActivityIndicator size="large" color={Colors.primary} style={{ paddingVertical: 40 }} />
                        ) : selectedScan ? (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={[styles.detailRiskBadge, { backgroundColor: getRiskColor(selectedScan.risk_level) + '20' }]}>
                                    <Text style={[styles.detailRiskText, { color: getRiskColor(selectedScan.risk_level) }]}>
                                        {selectedScan.risk_level} — {selectedScan.fraud_type || 'Safe'}
                                    </Text>
                                </View>

                                <Text style={styles.detailSectionTitle}>{t.history.fullMessage}</Text>
                                <Text style={styles.detailText}>{selectedScan.full_message}</Text>

                                {selectedScan.explanation && (
                                    <>
                                        <Text style={styles.detailSectionTitle}>{t.history.explanation}</Text>
                                        <Text style={styles.detailText}>{selectedScan.explanation}</Text>
                                    </>
                                )}

                                {selectedScan.suspicious_keywords?.length > 0 && (
                                    <>
                                        <Text style={styles.detailSectionTitle}>{t.history.keywords}</Text>
                                        <View style={styles.kwRow}>
                                            {selectedScan.suspicious_keywords.map((kw, i) => (
                                                <View key={i} style={styles.kwBadge}>
                                                    <Text style={styles.kwText}>{kw}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </>
                                )}

                                {selectedScan.prevention_tips?.length > 0 && (
                                    <>
                                        <Text style={styles.detailSectionTitle}>{t.history.tips}</Text>
                                        {selectedScan.prevention_tips.map((tip, i) => (
                                            <View key={i} style={styles.tipRow}>
                                                <Ionicons name="leaf-outline" size={13} color={Colors.secondary} style={{ marginRight: 6, marginTop: 2 }} />
                                                <Text style={styles.tipText}>{tip}</Text>
                                            </View>
                                        ))}
                                    </>
                                )}
                            </ScrollView>
                        ) : (
                            <Text style={styles.emptyText}>Could not load scan details.</Text>
                        )}
                    </View>
                </View>
            </Modal>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradBg: { flex: 1 },
    content: { padding: Spacing.m, paddingBottom: Spacing.xxl },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },

    header: { alignItems: 'center', marginBottom: Spacing.l, paddingTop: Spacing.s },
    iconBadge: {
        width: 56, height: 56, borderRadius: 28,
        justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.s,
        shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
    },
    title: { fontSize: 22, fontWeight: '900', color: Colors.primaryDark, letterSpacing: 1 },

    scanCard: {
        backgroundColor: Colors.surface, borderRadius: 14, padding: Spacing.m, marginBottom: Spacing.s,
        borderWidth: 1.5, borderColor: Colors.border,
        shadowColor: Colors.soil, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    },
    scanTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
    riskBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, borderWidth: 1.5 },
    riskText: { fontSize: 12, fontWeight: '700' },
    fraudType: { fontSize: 13, fontWeight: '600', color: Colors.textLight, flex: 1 },
    probability: { fontSize: 14, fontWeight: '800', color: Colors.text },
    messagePreview: { fontSize: 14, color: Colors.text, lineHeight: 20, marginBottom: 8 },
    scanBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    timeText: { fontSize: 12, color: Colors.textMuted },

    emptyCard: { alignItems: 'center', paddingVertical: Spacing.xxl },
    emptyText: { fontSize: 15, color: Colors.textMuted, marginTop: Spacing.m, textAlign: 'center' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: {
        backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: Spacing.l, maxHeight: '85%',
    },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.m },
    modalTitle: { fontSize: 18, fontWeight: '800', color: Colors.text },

    detailRiskBadge: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, marginBottom: Spacing.m },
    detailRiskText: { fontSize: 15, fontWeight: '700' },
    detailSectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginTop: Spacing.m, marginBottom: 6 },
    detailText: { fontSize: 14, color: Colors.textLight, lineHeight: 22 },

    kwRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
    kwBadge: {
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
        backgroundColor: Colors.danger + '15', borderWidth: 1, borderColor: Colors.danger + '40',
    },
    kwText: { fontSize: 12, fontWeight: '600', color: Colors.danger },

    tipRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
    tipText: { fontSize: 13, color: Colors.text, flex: 1, lineHeight: 20 },
});
