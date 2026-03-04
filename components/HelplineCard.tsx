import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../constants/theme';

export const HelplineCard = () => {
    const callHelpline = () => {
        let phoneNumber = 'tel:${1930}';
        if (Platform.OS !== 'android') {
            phoneNumber = 'telprompt:${1930}';
        }
        Linking.openURL(phoneNumber);
    };

    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Ionicons name="shield-checkmark" size={32} color={Colors.surface} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Cybercrime Helpline</Text>
                <Text style={styles.subtitle}>Report fraud immediately</Text>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={callHelpline}>
                <Ionicons name="call" size={24} color={Colors.primary} />
                <Text style={styles.callText}>1930</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        padding: Spacing.m,
        borderRadius: 12,
        borderLeftWidth: 6,
        borderLeftColor: Colors.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: Spacing.m,
    },
    iconContainer: {
        backgroundColor: Colors.primary,
        padding: Spacing.s,
        borderRadius: 8,
        marginRight: Spacing.m,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.textLight,
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FDEBD0',
        paddingHorizontal: Spacing.m,
        paddingVertical: Spacing.s,
        borderRadius: 20,
    },
    callText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.primary,
        marginLeft: 4,
    },
});
