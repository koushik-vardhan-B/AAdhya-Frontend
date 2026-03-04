import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ThemedButton } from '../components/ThemedButton';
import { Colors, Spacing } from '../constants/theme';

export default function AnalyzeScreen() {
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = () => {
        if (!message.trim()) {
            alert("Please paste a message to verify.");
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
                    <Text style={styles.title}>Did you receive a suspicious message?</Text>
                    <Text style={styles.subtitle}>Paste the SMS, WhatsApp message, or link below to check if it's safe or a scam.</Text>
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Paste your message here... (e.g. 'You won a lottery of Rs 25,00,000! Click here to claim...')"
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
                        <Text style={styles.loadingText}>Analyzing risk and searching for scams...</Text>
                    </View>
                ) : (
                    <ThemedButton
                        label="Check Now"
                        onPress={handleAnalyze}
                    />
                )}

                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>💡 Safety Tips</Text>
                    <Text style={styles.tipText}>• Never share your OTP with anyone.</Text>
                    <Text style={styles.tipText}>• Do not click on unknown links.</Text>
                    <Text style={styles.tipText}>• Banks never ask for your PIN to deposit money.</Text>
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
    tipsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.secondary,
        marginBottom: Spacing.s,
    },
    tipText: {
        fontSize: 15,
        color: Colors.text,
        marginBottom: 4,
    }
});
