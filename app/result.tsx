import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HelplineCard } from '../components/HelplineCard';
import { RiskMeter } from '../components/RiskMeter';
import { ThemedButton } from '../components/ThemedButton';
import { Colors, Spacing } from '../constants/theme';

// ---- Backend Response Interface ----
interface AnalysisResult {
    scam_probability: number;         // 0 to 100
    risk_level: 'Safe' | 'Suspicious' | 'High Risk';
    fraud_type: string;               // e.g. "Lottery Scam", "UPI Fraud"
    suspicious_keywords: string[];    // e.g. ["lottery", "won"]
    prevention_tips: string[];        // e.g. ["DO NOT click any links..."]
    explanation: string;              // AI reasoning for the decision
    helpline: string;                 // e.g. "1930"
}

// ---- Mock AI logic (replace with real API call later) ----
const analyzeMessage = (text: string): AnalysisResult => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('lottery') || lowerText.includes('prize') || lowerText.includes('won')) {
        return {
            scam_probability: 95,
            risk_level: 'High Risk',
            fraud_type: 'Lottery Scam',
            suspicious_keywords: ['lottery', 'prize', 'won'],
            prevention_tips: [
                'DO NOT click any links in the message.',
                'DO NOT share any OTP or UPI PIN.',
                'No legitimate lottery asks for advance fees — this is a scam.',
                'Delete the message immediately to stay safe.',
                'If you lost money, call Cybercrime Helpline 1930 immediately.'
            ],
            explanation: 'The message contains lottery/prize-related keywords which are commonly used in scam messages to lure victims into sharing personal or financial information.',
            helpline: '1930'
        };
    }
    if (lowerText.includes('job') || lowerText.includes('hiring') || lowerText.includes('salary')) {
        return {
            scam_probability: 80,
            risk_level: 'High Risk',
            fraud_type: 'Job Scam',
            suspicious_keywords: ['job', 'hiring', 'salary'],
            prevention_tips: [
                'Real companies never ask for money to offer a job.',
                'DO NOT pay any registration or processing fee.',
                'Verify the company name on official websites before responding.',
                'Report this number to Cybercrime Helpline 1930.'
            ],
            explanation: 'The message uses job/salary-related keywords that match patterns of fake job offers designed to extract money or personal data from victims.',
            helpline: '1930'
        };
    }
    if (lowerText.includes('upi') || lowerText.includes('pin') || lowerText.includes('bank account') || lowerText.includes('kyc')) {
        return {
            scam_probability: 90,
            risk_level: 'High Risk',
            fraud_type: 'UPI Fraud',
            suspicious_keywords: ['upi', 'pin', 'bank', 'kyc'],
            prevention_tips: [
                'Banks NEVER ask for your UPI PIN or OTP via SMS.',
                'DO NOT enter your PIN on any link sent via message.',
                'Visit your nearest bank branch for any KYC updates.',
                'If money was debited, call your bank and Helpline 1930 immediately.'
            ],
            explanation: 'The message references UPI/banking/KYC terms which are commonly used in financial fraud attempts to trick users into revealing sensitive banking credentials.',
            helpline: '1930'
        };
    }
    if (lowerText.includes('click') || lowerText.includes('link') || lowerText.includes('http')) {
        return {
            scam_probability: 65,
            risk_level: 'Suspicious',
            fraud_type: 'Phishing',
            suspicious_keywords: ['click', 'link', 'http'],
            prevention_tips: [
                'DO NOT click on unknown or shortened links.',
                'The message looks suspicious — do not trust unknown senders.',
                'Verify the sender by calling the official customer care number (search on Google, not from the SMS).',
                'If you accidentally clicked, change your passwords immediately.'
            ],
            explanation: 'The message contains suspicious links or prompts to click, which is a common phishing technique to steal login credentials or install malware.',
            helpline: '1930'
        };
    }

    return {
        scam_probability: 10,
        risk_level: 'Safe',
        fraud_type: 'Normal Message',
        suspicious_keywords: [],
        prevention_tips: [
            'The message seems safe, but always stay alert.',
            'Never share personal details like Aadhaar, PAN, or bank info with strangers.'
        ],
        explanation: 'No suspicious patterns or scam-related keywords were detected in this message.',
        helpline: '1930'
    };
};

export default function ResultScreen() {
    const { message } = useLocalSearchParams<{ message: string }>();
    const router = useRouter();

    const [result, setResult] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        if (message) {
            setResult(analyzeMessage(message));
        } else {
            setResult({
                scam_probability: 0, risk_level: 'Safe', fraud_type: 'Unknown',
                suspicious_keywords: [], prevention_tips: [], explanation: '', helpline: '1930'
            });
        }
    }, [message]);

    if (!result) return null;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            {/* Risk Meter Component */}
            <RiskMeter
                score={result.scam_probability}
                classification={result.risk_level}
            />

            {/* Fraud Type Information */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="warning-outline" size={24} color={Colors.warning} />
                    <Text style={styles.cardTitle}>Fraud Type Detected</Text>
                </View>
                <Text style={styles.fraudType}>{result.fraud_type}</Text>

                {result.suspicious_keywords.length > 0 && (
                    <View style={styles.keywordsContainer}>
                        <Text style={styles.keywordLabel}>Suspicious words found:</Text>
                        <View style={styles.badgesWrapper}>
                            {result.suspicious_keywords.map((kw: string, index: number) => (
                                <View key={index} style={styles.badge}>
                                    <Text style={styles.badgeText}>{kw}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </View>

            {/* AI Explanation */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="bulb-outline" size={24} color={Colors.primary} />
                    <Text style={styles.cardTitle}>Why this result?</Text>
                </View>
                <Text style={styles.explanationText}>{result.explanation}</Text>
            </View>

            {/* Preventive Guidance */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="shield-checkmark-outline" size={24} color={Colors.secondary} />
                    <Text style={styles.cardTitle}>Prevention Tips</Text>
                </View>
                {result.prevention_tips.map((tip: string, index: number) => (
                    <Text key={index} style={styles.bulletItem}>• {tip}</Text>
                ))}
            </View>

            {/* Helpline */}
            <HelplineCard />

            {/* Action Buttons */}
            <View style={styles.actions}>
                <ThemedButton
                    label="Check Another Message"
                    variant="outline"
                    onPress={() => router.back()}
                    style={{ marginBottom: Spacing.s }}
                />
                <ThemedButton
                    label="Back to Home"
                    variant="secondary"
                    onPress={() => router.replace('/')}
                />
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        padding: Spacing.m,
        paddingBottom: Spacing.xxl,
    },
    card: {
        backgroundColor: Colors.surface,
        padding: Spacing.m,
        borderRadius: 12,
        marginVertical: Spacing.s,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.s,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        paddingBottom: Spacing.s,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.text,
        marginLeft: Spacing.s,
    },
    fraudType: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.danger,
        marginVertical: Spacing.xs,
    },
    keywordsContainer: {
        marginTop: Spacing.m,
    },
    keywordLabel: {
        fontSize: 14,
        color: Colors.textLight,
        marginBottom: Spacing.xs,
    },
    badgesWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    badge: {
        backgroundColor: '#FDEDEC',
        paddingHorizontal: Spacing.s,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F5B7B1',
        marginRight: Spacing.s,
        marginBottom: Spacing.s,
    },
    badgeText: {
        color: Colors.danger,
        fontSize: 14,
        fontWeight: '500',
    },
    explanationText: {
        fontSize: 15,
        color: Colors.text,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    bulletItem: {
        fontSize: 15,
        color: Colors.text,
        lineHeight: 22,
        marginBottom: Spacing.s,
    },
    actions: {
        marginTop: Spacing.l,
    }
});
