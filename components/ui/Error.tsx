/* eslint-disable prettier/prettier */

import { H2, View } from 'tamagui';

import { MyButton } from './MyButton';

type Props = {
  onRetry: () => void;
  text?: string;
};

export const Error = ({ onRetry, text = 'Something went wrong' }: Props): JSX.Element => {
  return (
    <View flex={1} gap={10} backgroundColor="white" justifyContent="center" alignItems="center">
      <H2 color="black" textAlign="center" fontSize={20}>
        {text}
      </H2>
      <MyButton title="Retry" onPress={onRetry} />
    </View>
  );
};
