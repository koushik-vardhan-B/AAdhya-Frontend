import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator, RefreshControl, ScrollView,
    StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { CommunityReport, getCommunityFeed, translateText } from '../services/api';

const FRAUD_TYPES = ['All', 'UPI Fraud', 'Lottery Scam', 'Job Scam', 'Phishing', 'Others'];

export default function CommunityScreen() {
    const { t, locale } = useLanguage();
    const [reports, setReports] = useState<CommunityReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [translating, setTranslating] = useState<Record<string, string>>({});

    const fetchFeed = useCallback(async (fraudType?: string) => {
        try {
            const data = await getCommunityFeed(30, fraudType === 'All' ? undefined : fraudType);
            setReports(data);
        } catch {
            // silent
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchFeed(activeFilter); }, [fetchFeed, activeFilter]);
    const onRefresh = () => { setRefreshing(true); fetchFeed(activeFilter); };

    const handleTranslate = async (reportId: string, text: string) => {
        if (translating[reportId]) return; // Already translated
        if (locale === 'en') return; // No need to translate English
        setTranslating(prev => ({ ...prev, [reportId]: '...' }));
        try {
            const result = await translateText(text, locale);
            setTranslating(prev => ({ ...prev, [reportId]: result.translated }));
        } catch {
            setTranslating(prev => ({ ...prev, [reportId]: text })); // fallback
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
                        <Ionicons name="people-outline" size={28} color={Colors.wheat} />
                    </LinearGradient>
                    <Text style={styles.title}>{t.community.title}</Text>
                    <Text style={styles.subtitle}>{t.community.subtitle}</Text>
                </View>

                {/* Filter Chips */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                    {FRAUD_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.filterChip, activeFilter === type && styles.filterChipActive]}
                            onPress={() => {
                                setActiveFilter(type);
                                setLoading(true);
                            }}
                        >
                            <Text style={[styles.filterChipText, activeFilter === type && styles.filterChipTextActive]}>
                                {type === 'All' ? t.community.filterAll : type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Reports */}
                {reports.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Ionicons name="people-outline" size={48} color={Colors.textMuted} />
                        <Text style={styles.emptyText}>{t.community.noReports}</Text>
                    </View>
                ) : (
                    reports.map((report) => {
                        const riskColor = getRiskColor(report.risk_level);
                        const translated = translating[report.id];
                        return (
                            <View key={report.id} style={styles.reportCard}>
                                <View style={styles.reportTop}>
                                    <View style={[styles.fraudBadge, { backgroundColor: riskColor + '20', borderColor: riskColor }]}>
                                        <Ionicons name="warning-outline" size={12} color={riskColor} />
                                        <Text style={[styles.fraudBadgeText, { color: riskColor }]}> {report.fraud_type}</Text>
                                    </View>
                                    <Text style={[styles.riskLevel, { color: riskColor }]}>{report.risk_level}</Text>
                                </View>

                                <Text style={styles.messageText}>
                                    {translated && translated !== '...' ? translated : report.message_preview}
                                </Text>

                                <View style={styles.reportBottom}>
                                    <Text style={styles.timeText}>
                                        {t.community.reportedAt}: {formatTime(report.created_at)}
                                    </Text>
                                    {locale !== 'en' && (
                                        <TouchableOpacity
                                            onPress={() => handleTranslate(report.id, report.message_preview)}
                                            style={styles.translateBtn}
                                        >
                                            {translated === '...' ? (
                                                <ActivityIndicator size="small" color={Colors.primary} />
                                            ) : (
                                                <>
                                                    <Ionicons name="language-outline" size={14} color={Colors.primary} />
                                                    <Text style={styles.translateText}>
                                                        {translated ? '✓' : t.community.translate}
                                                    </Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradBg: { flex: 1 },
    content: { padding: Spacing.m, paddingBottom: Spacing.xxl },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },

    header: { alignItems: 'center', marginBottom: Spacing.m, paddingTop: Spacing.s },
    iconBadge: {
        width: 56, height: 56, borderRadius: 28,
        justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.s,
        shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
    },
    title: { fontSize: 22, fontWeight: '900', color: Colors.primaryDark, letterSpacing: 1 },
    subtitle: { fontSize: 13, color: Colors.textLight, textAlign: 'center', marginTop: 4 },

    filterRow: { marginBottom: Spacing.m, flexGrow: 0 },
    filterChip: {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
        backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8,
    },
    filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    filterChipText: { fontSize: 13, fontWeight: '600', color: Colors.text },
    filterChipTextActive: { color: Colors.wheat },

    reportCard: {
        backgroundColor: Colors.surface, borderRadius: 14, padding: Spacing.m, marginBottom: Spacing.s,
        borderWidth: 1.5, borderColor: Colors.border,
        shadowColor: Colors.soil, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
    },
    reportTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
    fraudBadge: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1,
    },
    fraudBadgeText: { fontSize: 12, fontWeight: '700' },
    riskLevel: { fontSize: 13, fontWeight: '800' },

    messageText: { fontSize: 14, color: Colors.text, lineHeight: 20, marginBottom: 10 },

    reportBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    timeText: { fontSize: 11, color: Colors.textMuted },
    translateBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: Colors.primary + '15' },
    translateText: { fontSize: 12, fontWeight: '600', color: Colors.primary },

    emptyCard: { alignItems: 'center', paddingVertical: Spacing.xxl },
    emptyText: { fontSize: 15, color: Colors.textMuted, marginTop: Spacing.m, textAlign: 'center' },
});
