import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '../constants/theme';

interface RiskMeterProps {
    score: number; // 0 to 100
    classification: 'Safe' | 'Suspicious' | 'High Risk';
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ score, classification }) => {
    const animatedWidth = useRef(new Animated.Value(0)).current;

    let color = Colors.secondary; // Default safe
    if (classification === 'Suspicious') color = Colors.warning;
    if (classification === 'High Risk') color = Colors.danger;

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: score,
            duration: 1000,
            useNativeDriver: false, // width animation doesn't support native driver
        }).start();
    }, [score]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Scam Probability: <Text style={[styles.scoreText, { color }]}>{score}%</Text></Text>

            <View style={styles.barBackground}>
                <Animated.View
                    style={[
                        styles.barFill,
                        {
                            backgroundColor: color,
                            width: animatedWidth.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%']
                            })
                        }
                    ]}
                />
            </View>

            <Text style={[styles.classification, { color }]}>{classification.toUpperCase()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.surface,
        padding: Spacing.m,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
        marginVertical: Spacing.m,
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.s,
    },
    scoreText: {
        fontSize: 20,
        fontWeight: '900',
    },
    barBackground: {
        height: 12,
        width: '100%',
        backgroundColor: Colors.border,
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: Spacing.s,
    },
    barFill: {
        height: '100%',
        borderRadius: 6,
    },
    classification: {
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
