/* eslint-disable prettier/prettier */

import { CircleEllipsis, Repeat, RotateCcw, Trash2 } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { Menu, MenuDivider, MenuItem } from 'react-native-material-menu';
import { XStack } from 'tamagui';

import { CustomPressable } from './CustomPressable';
import { CustomSubHeading } from './typography';
import { CustomBarIcon } from '../TabBarIcon';

type Props = {
  visible: boolean;
  onClose: () => void;
  onOpen: () => void;
  toggleOnline?: () => void;
  details: {
    productId: string;
    name: string;
    price: number;
    id: string;
  };
  online?: boolean;
  disabled?: boolean;
};

export const ActionMenu = ({
  onClose,
  visible,
  onOpen,
  details,
  online,
  toggleOnline,
  disabled,
}: Props): JSX.Element => {
  const router = useRouter();
  const handleDispose = () => {
    router.push(`/dispose?productId=${details?.productId}&name=${details?.name}&id=${details?.id}`);
    onClose();
  };

  const handleSupply = () => {
    router.push(
      `/restock?productId=${details?.productId}&name=${details?.name}&price=${details?.price}&id=${details?.id}`
    );
    onClose();
  };
  return (
    <Menu
      visible={visible}
      onRequestClose={onClose}
      anchor={
        <CustomPressable onPress={onOpen} style={{ flex: 0 }}>
          <CustomBarIcon size={25} color="black" icon={CircleEllipsis} />
        </CustomPressable>
      }>
      <MenuItem onPress={handleSupply}>
        <XStack gap={5}>
          <CustomBarIcon color="black" size={20} icon={Repeat} />
          <CustomSubHeading text="Restock item" />
        </XStack>
      </MenuItem>
      <MenuDivider />
      <MenuItem onPress={handleDispose}>
        <XStack gap={5}>
          <CustomBarIcon color="black" size={20} icon={Trash2} />
          <CustomSubHeading text="Dispose item" />
        </XStack>
      </MenuItem>
      {toggleOnline && <MenuDivider />}
      {toggleOnline && (
        <MenuItem onPress={toggleOnline} disabled={disabled}>
          <XStack gap={5}>
            <CustomBarIcon color="black" size={20} icon={RotateCcw} />
            <CustomSubHeading text={online ? 'Set offline' : 'Set online'} />
          </XStack>
        </MenuItem>
      )}
    </Menu>
  );
};
