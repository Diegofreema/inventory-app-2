/* eslint-disable prettier/prettier */

import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { Text, View } from 'tamagui';

import { colors } from '~/constants';

const AnimatedView = Animated.createAnimatedComponent(View);

export const ErrorBanner = ({
  text = 'Failed to synchronize data, please pull down to refresh',
}: {
  text?: string;
}): JSX.Element => {
  return (
    <AnimatedView entering={SlideInUp.duration(500)} exiting={SlideOutUp} bg={colors.green} p={5}>
      <Text textAlign="center" color="white">
        {text}
      </Text>
    </AnimatedView>
  );
};
