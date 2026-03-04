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
    let backgroundColor = Colors.primary;
    let textColor = Colors.surface;
    let borderColor = 'transparent';
    let borderWidth = 0;

    switch (variant) {
        case 'secondary':
            backgroundColor = Colors.secondary;
            break;
        case 'danger':
            backgroundColor = Colors.danger;
            break;
        case 'outline':
            backgroundColor = 'transparent';
            textColor = Colors.primary;
            borderColor = Colors.primary;
            borderWidth = 1;
            break;
    }

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor, borderColor, borderWidth }, style]}
            activeOpacity={0.8}
            {...props}
        >
            <Text style={[styles.text, { color: textColor }, textStyle]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: Spacing.m,
        paddingHorizontal: Spacing.xl,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginVertical: Spacing.s,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});
