/* eslint-disable prettier/prettier */

import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useCheckNotification } from "~/hooks/useCheckNotification";
import { useNotify } from "~/lib/tanstack/queries";
import { useStore } from "~/lib/zustand/useStore";

export default function MainAppLayout() {
  const { data } = useNotify();
  useCheckNotification({ data });
  const id = useStore((state) => state.id);

  if (!id) return <Redirect href="/login" />;
  return (
    <>
      <StatusBar style="dark" backgroundColor="white" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_left' }} />

    </>
  );
}
