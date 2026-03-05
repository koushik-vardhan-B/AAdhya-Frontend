import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Image, ScrollView,
    StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { analyzeImage } from '../services/api';

export default function ScanImageScreen() {
    const router = useRouter();
    const { t, locale } = useLanguage();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access gallery is needed.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setImageUri(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access camera is needed.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handleAnalyze = async () => {
        if (!imageUri) return;
        setIsAnalyzing(true);
        try {
            const result = await analyzeImage(imageUri, locale);
            router.push({
                pathname: '/result',
                params: { resultData: JSON.stringify(result) },
            });
        } catch (error: any) {
            alert(error.message || 'Failed to analyze image. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <LinearGradient colors={[Colors.backgroundDark, Colors.background, '#fff8e7']} style={styles.gradBg}>
            <ScrollView contentContainerStyle={styles.content}>

                {/* Header */}
                <View style={styles.header}>
                    <LinearGradient colors={[Colors.primaryLight, Colors.primary]} style={styles.iconBadge}>
                        <Ionicons name="camera-outline" size={28} color={Colors.wheat} />
                    </LinearGradient>
                    <Text style={styles.title}>{t.scanImage.title}</Text>
                    <Text style={styles.subtitle}>{t.scanImage.subtitle}</Text>
                </View>

                {/* Image Preview */}
                {imageUri && (
                    <View style={styles.previewCard}>
                        <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
                        <TouchableOpacity style={styles.removeBtn} onPress={() => setImageUri(null)}>
                            <Ionicons name="close-circle" size={28} color={Colors.danger} />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={pickImage} activeOpacity={0.8}>
                        <LinearGradient colors={[Colors.secondaryLight, Colors.secondary]} style={styles.actionBtnGrad}>
                            <Ionicons name="images-outline" size={22} color={Colors.primaryDark} />
                            <Text style={styles.actionBtnText}>{t.scanImage.pickImage}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionBtn} onPress={takePhoto} activeOpacity={0.8}>
                        <LinearGradient colors={[Colors.secondaryLight, Colors.secondary]} style={styles.actionBtnGrad}>
                            <Ionicons name="camera-outline" size={22} color={Colors.primaryDark} />
                            <Text style={styles.actionBtnText}>{t.scanImage.takePhoto}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Analyze Button */}
                {imageUri && (
                    isAnalyzing ? (
                        <View style={styles.analyzingContainer}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                            <Text style={styles.analyzingText}>{t.scanImage.analyzing}</Text>
                        </View>
                    ) : (
                        <TouchableOpacity onPress={handleAnalyze} activeOpacity={0.85} style={styles.analyzeBtn}>
                            <LinearGradient
                                colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={styles.analyzeBtnGrad}
                            >
                                <Ionicons name="scan-outline" size={20} color={Colors.wheat} />
                                <Text style={styles.analyzeBtnText}>  {t.scanImage.analyzeBtn}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    )
                )}

                {/* Info Tip */}
                <View style={styles.tipCard}>
                    <View style={styles.tipRow}>
                        <Ionicons name="information-circle-outline" size={18} color={Colors.secondary} style={{ marginRight: 8 }} />
                        <Text style={styles.tipTitle}>Supported Formats</Text>
                    </View>
                    <Text style={styles.tipText}>PNG, JPG, WEBP — Max 10MB</Text>
                    <Text style={styles.tipText}>Works best with clear, well-lit screenshots</Text>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradBg: { flex: 1 },
    content: { padding: Spacing.l, paddingBottom: Spacing.xxl },

    header: { alignItems: 'center', marginBottom: Spacing.xl, paddingTop: Spacing.m },
    iconBadge: {
        width: 64, height: 64, borderRadius: 32,
        justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.s,
        shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6,
    },
    title: { fontSize: 22, fontWeight: '900', color: Colors.primaryDark, letterSpacing: 1 },
    subtitle: { fontSize: 14, color: Colors.textLight, textAlign: 'center', marginTop: 4 },

    previewCard: {
        backgroundColor: Colors.surface, borderRadius: 16, padding: Spacing.s,
        marginBottom: Spacing.l, borderWidth: 1.5, borderColor: Colors.border,
        shadowColor: Colors.soil, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
    },
    previewImage: { width: '100%', height: 250, borderRadius: 12 },
    removeBtn: { position: 'absolute', top: 8, right: 8 },

    actionsRow: { flexDirection: 'row', gap: 12, marginBottom: Spacing.l },
    actionBtn: { flex: 1, borderRadius: 14, overflow: 'hidden' },
    actionBtnGrad: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 14, borderRadius: 14, gap: 8,
    },
    actionBtnText: { fontSize: 14, fontWeight: '700', color: Colors.primaryDark },

    analyzingContainer: { alignItems: 'center', paddingVertical: Spacing.l },
    analyzingText: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginTop: Spacing.s },

    analyzeBtn: {
        borderRadius: 14, overflow: 'hidden', marginBottom: Spacing.l,
        shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5,
    },
    analyzeBtnGrad: {
        flexDirection: 'row', paddingVertical: 16,
        alignItems: 'center', justifyContent: 'center', borderRadius: 14,
    },
    analyzeBtnText: { fontSize: 18, fontWeight: '900', color: Colors.wheat, letterSpacing: 1 },

    tipCard: {
        backgroundColor: Colors.surface, borderRadius: 14, padding: Spacing.m,
        borderLeftWidth: 4, borderLeftColor: Colors.secondary,
    },
    tipRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    tipTitle: { fontSize: 15, fontWeight: '700', color: Colors.secondary },
    tipText: { fontSize: 13, color: Colors.textLight, marginLeft: 26, lineHeight: 20 },
});
