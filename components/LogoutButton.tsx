/* eslint-disable prettier/prettier */

import { LogOut } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { CustomPressable } from './ui/CustomPressable';

import { LogoutModal } from '~/components/modals/LogOutModal';
import { colors } from '~/constants';
import { useShowToast } from '~/lib/zustand/useShowToast';
import { useStore } from '~/lib/zustand/useStore';

export const LogoutButton = (): JSX.Element => {
  const router = useRouter();
  const toast = useShowToast((state) => state.onShow);
  const [isOpen, setIsOpen] = useState(false);
  const { removeId, setIsAdmin } = useStore();
  const logout = () => {
    removeId();
    setIsAdmin(false);
    router.replace('/login');
    toast({ message: 'Logged out', description: 'Hope to see you soon 😊', type: 'success' });
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
