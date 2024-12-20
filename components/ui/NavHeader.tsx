/* eslint-disable prettier/prettier */

import { ArrowLeft } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { useWindowDimensions } from 'react-native';
import { View, XStack } from 'tamagui';

import { CustomPressable } from './CustomPressable';
import { CustomHeading } from './typography';

import { trimText } from "~/lib/helper";

type Props = {
  title: string;
};

export const NavHeader = ({ title }: Props) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const { width } = useWindowDimensions();

  const isSmaller = width < 400;
  const iconSize = isSmaller ? 20 : 25;
  return (
    <XStack gap={15} alignItems="center" justifyContent="space-between">
      <CustomPressable onPress={handleBack}>
        <ArrowLeft color="black" size={iconSize} />
      </CustomPressable>
      <CustomHeading text={trimText(title, 25)} fontSize={2.2} />
      <View width="$1" />
    </XStack>
  );
};
