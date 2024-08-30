/* eslint-disable prettier/prettier */

import Modal from 'react-native-modal';
import { Spinner, View } from 'tamagui';

import { colors } from '~/constants';
type Props = {
  visible: boolean;
};

export const LoadingModal = ({ visible }: Props): JSX.Element => {
  return (
    <Modal isVisible={visible} style={{ flex: 1 }}>
      <View flex={1} p={20} borderRadius="$3" alignItems="center" justifyContent="center">
        <Spinner color={colors.green} size="large" />
      </View>
    </Modal>
  );
};
