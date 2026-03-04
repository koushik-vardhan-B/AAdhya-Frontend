import React, { createContext, ReactNode, useCallback, useContext, useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import { getTranslations, Locale, Translations } from '../constants/i18n';

// ─── Persistent locale store ───
// Uses localStorage on web (survives full page reloads) and
// globalThis on native (survives module reloads).
const STORAGE_KEY = 'rakshana_locale';

function readLocale(): Locale {
    // Try localStorage first (web)
    if (Platform.OS === 'web') {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'en' || stored === 'hi' || stored === 'te') return stored;
        } catch { }
    }
    // Fallback to globalThis (native)
    const g = (globalThis as any)[STORAGE_KEY];
    if (g === 'en' || g === 'hi' || g === 'te') return g;
    return 'en';
}

function writeLocale(locale: Locale) {
    (globalThis as any)[STORAGE_KEY] = locale;
    if (Platform.OS === 'web') {
        try { localStorage.setItem(STORAGE_KEY, locale); } catch { }
    }
    // Notify all React subscribers
    listeners.forEach((fn) => fn());
}

// External store subscription
type Listener = () => void;
const listeners = new Set<Listener>();
function subscribe(listener: Listener) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}

// ─── React Context ───
interface LanguageContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
    locale: 'en',
    setLocale: () => { },
    t: getTranslations('en'),
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const locale = useSyncExternalStore(subscribe, readLocale, readLocale);
    const t = getTranslations(locale);
    const setLocale = useCallback((newLocale: Locale) => writeLocale(newLocale), []);

    return (
        <LanguageContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
