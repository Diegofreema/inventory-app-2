/* eslint-disable prettier/prettier */

import { ArrowLeft } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { View, XStack } from 'tamagui';

import { CustomPressable } from './CustomPressable';
import { CustomHeading } from './typography';

type Props = {
  title: string;
};

export const NavHeader = ({ title }: Props): JSX.Element => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <XStack gap={15} alignItems="center" justifyContent="space-between">
      <CustomPressable onPress={handleBack} style={{ flex: 0 }}>
        <ArrowLeft color="black" size={30} />
      </CustomPressable>
      <CustomHeading text={title} fontSize={20} />
      <View width="$1" />
    </XStack>
  );
};
