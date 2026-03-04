import { Stack } from 'expo-router';
import { Colors } from '../constants/theme';

export default function Layout() {
  return (
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
        name="home"
        options={{
          title: 'Digital Safety Guard',
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          title: 'Analysis Result',
        }}
      />
    </Stack>
  );
}
