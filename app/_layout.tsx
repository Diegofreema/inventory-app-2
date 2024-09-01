import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import { openDatabaseSync, SQLiteProvider } from 'expo-sqlite/next';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast, { BaseToast, ErrorToast, ToastConfigParams } from 'react-native-toast-message';
import { Spinner, View } from 'tamagui';

import { colors } from '~/constants';
import migrations from '~/drizzle/migrations';

SplashScreen.preventAutoHideAsync();
const dbName = 'db.db';

const expoDb = openDatabaseSync(dbName, { enableChangeListener: true });
const db = drizzle(expoDb);
const queryClient = new QueryClient();
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400',
      }}
    />
  ),

  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
    />
  ),

  green: ({ text1, text2 }: ToastConfigParams<any>) => (
    <View
      backgroundColor={colors.green}
      borderRadius={10}
      padding={10}
      width="95%"
      marginHorizontal="auto">
      <Text style={{ fontFamily: 'Inter', color: 'white', fontSize: 13 }}>{text1}</Text>
      <Text style={{ fontFamily: 'InterBold', color: 'white', fontSize: 15 }}>{text2}</Text>
    </View>
  ),
};
export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);
  const { success, error } = useMigrations(db, migrations);
  useDrizzleStudio(expoDb);
  if (error) {
    console.log(error);

    return (
      <View flex={1} justifyContent="center" alignItems="center">
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View flex={1} justifyContent="space-between" alignItems="center">
        <Spinner backgroundColor={colors.green} />
      </View>
    );
  }
  if (!loaded) return null;

  return (
    <SQLiteProvider databaseName={dbName}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" backgroundColor="white" />
          <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
        <Toast config={toastConfig} position="top" type="green" visibilityTime={4000} />
      </GestureHandlerRootView>
    </SQLiteProvider>
  );
}
