/* eslint-disable prettier/prettier */

import { useDrawerStatus } from '@react-navigation/drawer';
// import { DrawerActions } from '@react-navigation/native';
import { Bell } from '@tamagui/lucide-icons';
import { usePathname, useRouter } from 'expo-router';
// import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Circle, XStack } from 'tamagui';

import { CustomPressable } from './CustomPressable';
import { CustomSubHeading } from './typography';

import { useRead } from '~/lib/zustand/useRead';
// import { MenuSvg } from '../svg/MenuSvg';

export const DrawerHeader = (): JSX.Element => {
  const { top } = useSafeAreaInsets();
  const read = useRead((state) => state.read);
  const pathname = usePathname();
  const formattedPathname = pathname === '/' ? 'HOME' : pathname.replace('/', '').toUpperCase();
  const router = useRouter();
  // const navigation = useNavigation();
  const isOpen = useDrawerStatus() === 'open';
  // const onPress = () => {
  //   navigation.dispatch(DrawerActions.openDrawer);
  // };

  const onNavigate = () => {
    router.push('/notification');
  };

  return (
    <XStack backgroundColor="white" paddingTop={top + 5} paddingHorizontal="$4" gap={5}>
      {/* <Pressable
        style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1, padding: 5 })}
        onPress={onPress}>
        {!isOpen && <MenuSvg />}
      </Pressable> */}
      {!isOpen && (
        <CustomSubHeading
          text={formattedPathname}
          fontSize={20}
          color="black"
          style={{ fontFamily: 'InterBold' }}
        />
      )}

      <CustomPressable
        onPress={onNavigate}
        style={{ alignSelf: 'flex-end', flex: 0, position: 'absolute', right: 20 }}>
        <Bell size={25} color="black" />
        {!read && (
          <Circle
            width={10}
            height={10}
            backgroundColor="red"
            position="absolute"
            top={0}
            right={0}
          />
        )}
      </CustomPressable>
    </XStack>
  );
};
