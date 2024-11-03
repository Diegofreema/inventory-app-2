/* eslint-disable prettier/prettier */

import { LogOut } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useState } from "react";
import Toast from "react-native-toast-message";

import { CustomPressable } from './ui/CustomPressable';

import { LogoutModal } from "~/components/modals/LogOutModal";
import { colors } from '~/constants';
import { useStore } from '~/lib/zustand/useStore';

export const LogoutButton = (): JSX.Element => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { removeId, setIsAdmin } = useStore();
  const logout = () => {
    removeId();
    setIsAdmin(false);
    router.replace('/login');
    Toast.show({
      text1: 'Log out successfully',
      text2: 'Hope to see you soon 😊'
    })
  };

  const onOpen = () => setIsOpen(true);
  return (
    <>
    <LogoutModal logOut={logout} visible={isOpen} onClose={() => setIsOpen(false)} />
    <CustomPressable onPress={onOpen} style={{ flex: 0 }}>
      <LogOut color={colors.green} size={30} />
    </CustomPressable>
    </>
  );
};
