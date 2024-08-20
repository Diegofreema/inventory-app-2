/* eslint-disable prettier/prettier */
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function OtherScreenLayout() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar backgroundColor="white" style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
