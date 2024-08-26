/* eslint-disable prettier/prettier */

import Modal from 'react-native-modal';
import { Text, View, XStack } from 'tamagui';

import { MyButton } from '../ui/MyButton';
type Props = {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export const DeleteStaffModal = ({ onClose, visible, onDelete }: Props): JSX.Element => {
  return (
    <View style={{ flex: 1 }}>
      <Modal isVisible={visible}>
        <View style={{ flex: 1 }}>
          <Text color="red" fontSize={20} fontWeight="bold" mb={15}>
            Are you sure you want to remove this staff?
          </Text>

          <XStack gap={10}>
            <MyButton title="Cancel" onPress={onClose} flex={1} />
            <MyButton title="Delete" onPress={onDelete} bg="red" flex={1} />
          </XStack>
        </View>
      </Modal>
    </View>
  );
};
