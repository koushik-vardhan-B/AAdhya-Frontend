import { Stack } from 'expo-router';
import { Colors } from '../constants/theme';
import { LanguageProvider } from '../context/LanguageContext';

export default function Layout() {
  return (
    <LanguageProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.surface,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'Welcome',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            title: 'Sign In',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="home"
          options={{
            title: 'Be safe with us',
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="result"
          options={{
            title: 'Analysis Result',
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            title: 'Create Account',
            headerShown: false,
          }}
        />
      </Stack>
    </LanguageProvider>
  );
}
