import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedButton } from '../components/ThemedButton';
import { Colors, Spacing } from '../constants/theme';

export default function SignUpScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSignUp = () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            alert('Please fill in all fields.');
            return;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        // TODO: Replace with real signup API call
        alert('Account created successfully!');
        router.replace('/');
    };

    const handleGoogleSignUp = () => {
        // TODO: Integrate real Google Sign-In
        router.replace('/home');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Header */}
                <View style={styles.brandContainer}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="person-add" size={40} color={Colors.surface} />
                    </View>
                    <Text style={styles.appName}>Create Account</Text>
                    <Text style={styles.tagline}>Join us to stay safe from online fraud</Text>
                </View>

                {/* Sign Up Form Card */}
                <View style={styles.formCard}>

                    {/* Full Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="person-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                placeholderTextColor="#aaa"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    {/* Email */}
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

                    {/* Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Create a password"
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

                    {/* Confirm Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color={Colors.textLight} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                placeholderTextColor="#aaa"
                                secureTextEntry={!showPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                    </View>

                    {/* Sign Up Button */}
                    <ThemedButton
                        label="Create Account"
                        onPress={handleSignUp}
                        style={{ marginTop: Spacing.m }}
                    />

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Google Sign Up */}
                    <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
                        <View style={styles.googleIconCircle}>
                            <Text style={styles.googleG}>G</Text>
                        </View>
                        <Text style={styles.googleButtonText}>Sign up with Google</Text>
                    </TouchableOpacity>

                    {/* Already have account */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
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
        flexGrow: 1,
        justifyContent: 'center',
        padding: Spacing.l,
    },
    brandContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.secondary,
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
        fontSize: 26,
        fontWeight: 'bold',
        color: Colors.text,
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.l,
    },
    loginText: {
        fontSize: 14,
        color: Colors.textLight,
    },
    loginLink: {
        fontSize: 14,
        color: Colors.primary,
        fontWeight: 'bold',
    },
});
