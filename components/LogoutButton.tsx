/* eslint-disable prettier/prettier */

import { LogOut } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';

import { CustomPressable } from './ui/CustomPressable';

import { colors } from '~/constants';
import { useStore } from '~/lib/zustand/useStore';

export const LogoutButton = (): JSX.Element => {
  const router = useRouter();
  const { removeId, setIsAdmin } = useStore();
  const logout = () => {
    removeId();
    setIsAdmin(false);
    router.replace('/login');
  };
  return (
    <CustomPressable onPress={logout} style={{ flex: 0 }}>
      <LogOut color={colors.green} size={30} />
    </CustomPressable>
  );
};
