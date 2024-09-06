import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast, { BaseToast, ErrorToast, ToastConfigParams } from 'react-native-toast-message';
import { TamaguiProvider, View } from 'tamagui';

import { colors } from '~/constants';
import { useUploadOffline } from '~/hooks/useUploadOffline';
import config from '~/tamagui.config';

SplashScreen.preventAutoHideAsync();

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
  const [loaded, err] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });
  useUploadOffline();
  useEffect(() => {
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        console.log(error);
      }
    }

    onFetchUpdateAsync();
  }, []);
  useEffect(() => {
    console.log(err);
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <TamaguiProvider config={config}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" backgroundColor="white" />
          <Stack screenOptions={{ headerShown: false }} />
        </QueryClientProvider>
        <Toast config={toastConfig} position="top" type="green" visibilityTime={4000} />
      </GestureHandlerRootView>
    </TamaguiProvider>
  );
}
