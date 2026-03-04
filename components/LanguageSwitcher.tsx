import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Locale, localeLabels } from '../constants/i18n';
import { Colors } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';

const locales: Locale[] = ['en', 'hi', 'te'];

export const LanguageSwitcher = () => {
    const { locale, setLocale } = useLanguage();

    return (
        <View style={styles.container}>
            {locales.map((loc) => (
                <TouchableOpacity
                    key={loc}
                    style={[styles.btn, locale === loc && styles.btnActive]}
                    onPress={() => setLocale(loc)}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.btnText, locale === loc && styles.btnTextActive]}>
                        {localeLabels[loc]}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: Colors.backgroundDark,
        borderRadius: 20,
        padding: 3,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    btn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 17,
    },
    btnActive: {
        backgroundColor: Colors.primary,
    },
    btnText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.textMuted,
    },
    btnTextActive: {
        color: Colors.wheat,
    },
});
