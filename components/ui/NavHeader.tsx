/* eslint-disable prettier/prettier */

import { ArrowLeft } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
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
  const { width } = useWindowDimensions();
  console.log(width);
  const isSmaller = width < 400;
  const iconSize = isSmaller ? 20 : 30;
  return (
    <XStack gap={15} alignItems="center" justifyContent="space-between">
      <CustomPressable onPress={handleBack} style={{ flex: 0 }}>
        <ArrowLeft color="black" size={iconSize} />
      </CustomPressable>
      <CustomHeading text={title} fontSize={2.2} />
      <View width="$1" />
    </XStack>
  );
};
