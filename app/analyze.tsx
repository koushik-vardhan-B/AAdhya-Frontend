import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ThemedButton } from '../components/ThemedButton';
import { Colors, Spacing } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

export default function AnalyzeScreen() {
    const router = useRouter();
    const { t } = useLanguage();
    const [message, setMessage] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = () => {
        if (!message.trim()) {
            alert(t.analyze.pasteMessage);
            return;
        }

        setIsAnalyzing(true);

        // Simulate AI API Call delay
        setTimeout(() => {
            setIsAnalyzing(false);
            // Pass the message to the result screen
            router.push({
                pathname: '/result',
                params: { message }
            });
        }, 1500);
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <Text style={styles.title}>{t.analyze.title}</Text>
                    <Text style={styles.subtitle}>{t.analyze.subtitle}</Text>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textArea}
                        placeholder={t.analyze.placeholder}
                        multiline
                        numberOfLines={6}
                        value={message}
                        onChangeText={setMessage}
                        textAlignVertical="top"
                    />
                </View>

                {isAnalyzing ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary} />
                        <Text style={styles.loadingText}>{t.analyze.analyzing}</Text>
                    </View>
                ) : (
                    <ThemedButton
                        label={t.analyze.checkNow}
                        onPress={handleAnalyze}
                    />
                )}

                <View style={styles.tipsContainer}>
                    <View style={styles.tipsTitleRow}>
                        <Ionicons name="bulb-outline" size={18} color={Colors.secondary} style={{ marginRight: 6 }} />
                        <Text style={styles.tipsTitle}>{t.analyze.tipsTitle}</Text>
                    </View>
                    <Text style={styles.tipText}>• {t.analyze.tip1}</Text>
                    <Text style={styles.tipText}>• {t.analyze.tip2}</Text>
                    <Text style={styles.tipText}>• {t.analyze.tip3}</Text>
                </View>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: Spacing.l,
    },
    header: {
        marginBottom: Spacing.m,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.s,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textLight,
        lineHeight: 22,
    },
    inputContainer: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: Spacing.s,
        marginBottom: Spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    textArea: {
        height: 150,
        fontSize: 16,
        color: Colors.text,
        padding: Spacing.s,
    },
    loadingContainer: {
        alignItems: 'center',
        marginVertical: Spacing.l,
    },
    loadingText: {
        marginTop: Spacing.m,
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
    },
    tipsContainer: {
        marginTop: Spacing.xl,
        backgroundColor: '#E8F6F3', // Light safe green
        padding: Spacing.m,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: Colors.secondary,
    },
    tipsTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.s,
    },
    tipsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.secondary,
    },
    tipText: {
        fontSize: 15,
        color: Colors.text,
        marginBottom: 4,
    }
});
