import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator, RefreshControl, ScrollView,
    StyleSheet, Text, View,
} from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { getStats, getTopKeywords, KeywordItem, StatsResponse } from '../services/api';

export default function DashboardScreen() {
    const { t } = useLanguage();
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [keywords, setKeywords] = useState<KeywordItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [statsData, keywordsData] = await Promise.all([
                getStats(),
                getTopKeywords(10),
            ]);
            setStats(statsData);
            setKeywords(keywordsData);
        } catch {
            // Silently fail — show empty state
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const onRefresh = () => { setRefreshing(true); fetchData(); };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    const statCards = stats ? [
        { label: t.dashboard.totalScans, value: stats.total_scans.toString(), icon: 'scan-outline' as const, color: Colors.primary },
        { label: t.dashboard.fraudDetected, value: stats.fraud_detected.toString(), icon: 'warning-outline' as const, color: Colors.danger },
        { label: t.dashboard.safeMessages, value: stats.safe_messages.toString(), icon: 'shield-checkmark-outline' as const, color: Colors.safe },
        { label: t.dashboard.fraudRate, value: `${stats.fraud_rate}%`, icon: 'trending-up-outline' as const, color: Colors.suspicious },
    ] : [];

    return (
        <LinearGradient colors={[Colors.backgroundDark, Colors.background, '#fff8e7']} style={styles.gradBg}>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <LinearGradient colors={[Colors.primaryLight, Colors.primary]} style={styles.iconBadge}>
                        <Ionicons name="bar-chart-outline" size={28} color={Colors.wheat} />
                    </LinearGradient>
                    <Text style={styles.title}>{t.dashboard.title}</Text>
                </View>

                {/* Stats Grid */}
                {stats && (
                    <View style={styles.statsGrid}>
                        {statCards.map((card, i) => (
                            <View key={i} style={styles.statCard}>
                                <View style={[styles.statIconBg, { backgroundColor: card.color + '20' }]}>
                                    <Ionicons name={card.icon} size={22} color={card.color} />
                                </View>
                                <Text style={styles.statValue}>{card.value}</Text>
                                <Text style={styles.statLabel}>{card.label}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* System Status */}
                {stats && (
                    <View style={styles.card}>
                        <View style={styles.cardHeaderRow}>
                            <Ionicons name="pulse-outline" size={20} color={Colors.safe} />
                            <Text style={styles.cardTitle}>{t.dashboard.systemStatus}</Text>
                        </View>
                        <View style={styles.statusRow}>
                            <View style={styles.statusDot} />
                            <Text style={styles.statusText}>{t.dashboard.operational}</Text>
                        </View>
                        <Text style={styles.modelText}>Layer 1: {stats.models_loaded.layer1}</Text>
                        <Text style={styles.modelText}>Layer 2: {stats.models_loaded.layer2}</Text>
                    </View>
                )}

                {/* Top Scam Patterns */}
                {stats && stats.top_scam_patterns.length > 0 && (
                    <View style={styles.card}>
                        <View style={styles.cardHeaderRow}>
                            <Ionicons name="analytics-outline" size={20} color={Colors.suspicious} />
                            <Text style={styles.cardTitle}>{t.dashboard.topPatterns}</Text>
                        </View>
                        {stats.top_scam_patterns.map((p, i) => (
                            <View key={i} style={styles.patternRow}>
                                <Text style={styles.patternRank}>#{i + 1}</Text>
                                <Text style={styles.patternName}>{p.pattern}</Text>
                                <View style={styles.patternCountBadge}>
                                    <Text style={styles.patternCount}>{p.count}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Top Keywords */}
                {keywords.length > 0 && (
                    <View style={styles.card}>
                        <View style={styles.cardHeaderRow}>
                            <Ionicons name="key-outline" size={20} color={Colors.primary} />
                            <Text style={styles.cardTitle}>{t.dashboard.topKeywords}</Text>
                        </View>
                        <View style={styles.keywordsWrap}>
                            {keywords.map((kw, i) => (
                                <View key={i} style={styles.keywordBadge}>
                                    <Text style={styles.keywordText}>{kw.keyword}</Text>
                                    <View style={styles.keywordFreqBadge}>
                                        <Text style={styles.keywordFreq}>{kw.frequency}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Empty state */}
                {!stats && (
                    <View style={styles.emptyCard}>
                        <Ionicons name="analytics-outline" size={48} color={Colors.textMuted} />
                        <Text style={styles.emptyText}>{t.dashboard.noData}</Text>
                    </View>
                )}
            </ScrollView>
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

    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: Spacing.m },
    statCard: {
        width: '47%', backgroundColor: Colors.surface, borderRadius: 16, padding: Spacing.m,
        alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border,
        shadowColor: Colors.soil, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
    },
    statIconBg: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    statValue: { fontSize: 28, fontWeight: '900', color: Colors.text },
    statLabel: { fontSize: 12, fontWeight: '600', color: Colors.textLight, textAlign: 'center', marginTop: 2 },

    card: {
        backgroundColor: Colors.surface, borderRadius: 16, padding: Spacing.m, marginBottom: Spacing.m,
        borderWidth: 1.5, borderColor: Colors.border,
        shadowColor: Colors.soil, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
    },
    cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.m, gap: 8 },
    cardTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },

    statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.safe, marginRight: 8 },
    statusText: { fontSize: 15, fontWeight: '700', color: Colors.safe },
    modelText: { fontSize: 13, color: Colors.textLight, marginLeft: 18, lineHeight: 20 },

    patternRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
    patternRank: { fontSize: 14, fontWeight: '800', color: Colors.textMuted, width: 30 },
    patternName: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text },
    patternCountBadge: { backgroundColor: Colors.primaryLight + '30', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
    patternCount: { fontSize: 13, fontWeight: '700', color: Colors.primary },

    keywordsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    keywordBadge: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundDark,
        borderRadius: 12, paddingLeft: 12, paddingRight: 4, paddingVertical: 6,
        borderWidth: 1, borderColor: Colors.border,
    },
    keywordText: { fontSize: 13, fontWeight: '600', color: Colors.text, marginRight: 6 },
    keywordFreqBadge: { backgroundColor: Colors.primary + '25', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
    keywordFreq: { fontSize: 11, fontWeight: '700', color: Colors.primary },

    emptyCard: { alignItems: 'center', paddingVertical: Spacing.xxl },
    emptyText: { fontSize: 15, color: Colors.textMuted, marginTop: Spacing.m, textAlign: 'center' },
});
