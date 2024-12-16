/* eslint-disable prettier/prettier */

import { Redirect, Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "tamagui";

import { SyncBanner } from "~/components/SyncBanner";
import { useCheckNotification } from "~/hooks/useCheckNotification";
import { useNetwork } from "~/hooks/useNetwork";
import { useOfflineNumber } from "~/hooks/useUploadOffline";
import { useNotify } from "~/lib/tanstack/queries";
import { useStore } from "~/lib/zustand/useStore";

export default function MainAppLayout() {
  const { data } = useNotify();
  useCheckNotification({ data });

  // const { hasFetched } = useHasFetched();
  const productNumber = useOfflineNumber();
  const pathname = usePathname();
  const isOnline = useNetwork();
  const id = useStore((state) => state.id);
  // const removeId = useStore((state) => state.removeId);

  if (!id) return <Redirect href="/login" />;
  // if (id && !hasFetched) {
  //   removeId();
  //   return <Redirect href="/login" />;
  // }
  const showSyncBanner = pathname !== '/login' && isOnline && productNumber > 0;
  return (
    <View flex={1}>
      <StatusBar style="dark" backgroundColor="white" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_left' }} />
      {showSyncBanner && <SyncBanner />}
    </View>
  );
}
