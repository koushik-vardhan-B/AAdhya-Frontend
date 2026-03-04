import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../constants/theme';

interface ThemedButtonProps extends TouchableOpacityProps {
    label: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({ label, variant = 'primary', style, textStyle, ...props }) => {
    if (variant === 'outline') {
        return (
            <TouchableOpacity style={[styles.outlineButton, style]} activeOpacity={0.8} {...props}>
                <Text style={[styles.outlineText, textStyle]}>{label}</Text>
            </TouchableOpacity>
        );
    }

    const gradients: Record<string, [string, string, string]> = {
        primary: [Colors.primaryLight, Colors.primary, Colors.primaryDark],
        secondary: [Colors.secondaryLight, Colors.secondary, Colors.secondaryDark],
        danger: ['#C0392B', '#A4161A', '#7B0000'],
    };

    const grad = gradients[variant] || gradients.primary;

    return (
        <TouchableOpacity style={[styles.buttonWrapper, style]} activeOpacity={0.85} {...props}>
            <LinearGradient colors={grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
                <Text style={[styles.text, textStyle]}>{label}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
        marginVertical: Spacing.s,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 4,
    },
    gradient: {
        paddingVertical: Spacing.m,
        paddingHorizontal: Spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.wheat,
        letterSpacing: 0.5,
    },
    outlineButton: {
        paddingVertical: Spacing.m,
        paddingHorizontal: Spacing.xl,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.primary,
        marginVertical: Spacing.s,
        backgroundColor: 'transparent',
    },
    outlineText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.primary,
    },
});
