import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import * as Sentry from '@sentry/react-native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack,  } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Updates from 'expo-updates';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';
import { TamaguiProvider } from 'tamagui';

import config from '~/tamagui.config';

// const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();
//
// Sentry.init({
//   dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
//   attachScreenshot: true,
//   integrations: [
//     new Sentry.ReactNativeTracing({
//       routingInstrumentation,
//       enableNativeFramesTracking: true,
//     }),
//   ],
//   tracesSampleRate: 1.0,
//   _experiments: {
//     profilesSampleRate: 1.0,
//     replaysSessionSampleRate: 1.0,
//     replaysOnErrorSampleRate: 1.0,
//   },
// });

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

function RootLayout() {
  const [loaded, err] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });
  // const ref = useNavigationContainerRef();
  //
  // useEffect(() => {
  //   if (ref?.current) {
  //     routingInstrumentation.registerNavigationContainer(ref);
  //   }
  // }, [ref]);
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
        <Toaster position="top-center" />
      </GestureHandlerRootView>
    </TamaguiProvider>
  );
}

export default RootLayout;
