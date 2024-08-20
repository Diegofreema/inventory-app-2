/* eslint-disable prettier/prettier */

import { CircleEllipsis, Repeat, Trash2 } from '@tamagui/lucide-icons';
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
  details: {
    productId: string;
    name: string;
    price: string;
  };
};

export const ActionMenu = ({ onClose, visible, onOpen, details }: Props): JSX.Element => {
  const router = useRouter();
  const handleDispose = () => {
    router.push(`/dispose?productId=${details?.productId}&name=${details?.name}`);
    onClose();
  };

  const handleSupply = () => {
    router.push(
      `/restock?productId=${details?.productId}&name=${details?.name}&price=${details?.price}`
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
    </Menu>
  );
};
