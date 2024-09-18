/* eslint-disable prettier/prettier */

import { Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useCheckNotification } from '~/hooks/useCheckNotification';
import { useUploadOffline } from '~/hooks/useUploadOffline';
import { useNotify } from '~/lib/tanstack/queries';
import { useStore } from '~/lib/zustand/useStore';

export default function MainAppLayout() {
  const { data } = useNotify();
  useCheckNotification({ data });
  const id = useStore((state) => state.id);
  useUploadOffline();
  if (!id) return <Redirect href="/login" />;
  return (
    <>
      <StatusBar style="dark" backgroundColor="white" />
      {/* <SafeAreaProvider style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}> */}
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_left' }} />
      {/* </SafeAreaView>
      </SafeAreaProvider> */}
    </>
  );
}
