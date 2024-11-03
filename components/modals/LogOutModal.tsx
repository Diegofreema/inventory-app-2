/* eslint-disable prettier/prettier */

import Modal from 'react-native-modal';
import { Text, View, XStack } from 'tamagui';

import { MyButton } from '../ui/MyButton';
import { useWindowDimensions } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  logOut: () => void;
};

export const LogoutModal = ({ onClose, visible, logOut }: Props): JSX.Element => {
  const {width} = useWindowDimensions();
  const isBig = width > 768;
  const isMid = width < 768;
  const isSmall = width < 425;

  const finalWidth = isBig ? '50%' : isMid ? '60%' : isSmall ? '100%' : '100%';
  return (
    <Modal
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      isVisible={visible}
      backdropColor="white"
      style={{}}>
      <View
        backgroundColor="white"
        borderWidth={1}
        borderColor="#ccc"
        height={300}
        padding={20}
        width={finalWidth}
        mx='auto'
        borderRadius="$3"
        alignItems="center"
        justifyContent="center">
        <Text color="red" fontSize={30} fontWeight="bold" textAlign="center" marginBottom={15}>
          Are you sure you want to logout?
        </Text>

        <XStack gap={10}>
          <MyButton title="Cancel" onPress={onClose} flex={1} />
          <MyButton title="Logout" onPress={logOut} backgroundColor="red" flex={1} />
        </XStack>
      </View>
    </Modal>
  );
};
