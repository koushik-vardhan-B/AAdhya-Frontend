import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedButton } from '../components/ThemedButton';
import { Colors, Spacing } from '../constants/theme';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        if (!email.trim() || !password.trim()) {
            alert('Please enter both email and password.');
            return;
        }
        // TODO: Replace with real authentication
        router.replace('/home');
    };

    const handleGoogleLogin = () => {
        // TODO: Replace with real Google Sign-In SDK integration
        // For now, show a simulated message
        alert('Google Sign-In will be integrated with backend. For now, use email & password to login.');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header / Branding */}
                <View style={styles.brandContainer}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="shield-checkmark" size={48} color={Colors.surface} />
                    </View>
                    <Text style={styles.appName}>Digital Safety Guard</Text>
                    <Text style={styles.tagline}>Protecting rural citizens from online fraud</Text>
                </View>

                {/* Login Form Card */}
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>Sign In</Text>

                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#aaa"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#aaa"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={20}
                                    color={Colors.textLight}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity style={styles.forgotContainer}>
                        <Text style={styles.forgotText}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <ThemedButton
                        label="Sign In"
                        onPress={handleLogin}
                        style={{ marginTop: Spacing.s }}
                    />

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Google Sign In Button */}
                    <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
                        <View style={styles.googleIconCircle}>
                            <Text style={styles.googleG}>G</Text>
                        </View>
                        <Text style={styles.googleButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/signup')}>
                            <Text style={styles.signupLink}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footerText}>Stay safe from phishing, UPI frauds & scam messages</Text>

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
        flexGrow: 1,
        justifyContent: 'center',
        padding: Spacing.l,
    },
    brandContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    logoCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.m,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.primary,
        textAlign: 'center',
    },
    tagline: {
        fontSize: 14,
        color: Colors.textLight,
        textAlign: 'center',
        marginTop: 4,
    },
    formCard: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: Spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    formTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.l,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: Spacing.m,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        paddingHorizontal: Spacing.m,
        backgroundColor: '#FAFAFA',
        height: 50,
    },
    inputIcon: {
        marginRight: Spacing.s,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.text,
    },
    forgotContainer: {
        alignItems: 'flex-end',
        marginBottom: Spacing.s,
    },
    forgotText: {
        fontSize: 13,
        color: Colors.primary,
        fontWeight: '500',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.l,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    dividerText: {
        marginHorizontal: Spacing.m,
        fontSize: 13,
        color: Colors.textLight,
        fontWeight: '600',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 10,
        paddingVertical: 12,
        backgroundColor: Colors.surface,
    },
    googleIconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#4285F4',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.s,
    },
    googleG: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.l,
    },
    signupText: {
        fontSize: 14,
        color: Colors.textLight,
    },
    signupLink: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: 'bold',
    },
    footerText: {
        textAlign: 'center',
        color: Colors.textLight,
        fontSize: 13,
        marginTop: Spacing.xl,
    },
});
