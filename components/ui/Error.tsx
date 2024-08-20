/* eslint-disable prettier/prettier */

import { H2, View } from 'tamagui';

import { MyButton } from './MyButton';

type Props = {
  onRetry: () => void;
};

export const Error = ({ onRetry }: Props): JSX.Element => {
  return (
    <View flex={1} gap={10} bg="white" justifyContent="center" alignItems="center">
      <H2 color="black" textAlign="center">
        Something went wrong
      </H2>
      <MyButton title="Retry" onPress={onRetry} />
    </View>
  );
};
