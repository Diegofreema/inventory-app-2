/* eslint-disable prettier/prettier */

import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { View } from 'tamagui';

const AnimatedView = Animated.createAnimatedComponent(View);
type Props = {
  children: React.ReactNode;
};
export const AnimatedContainer = ({ children }: Props): JSX.Element => {
  return (
    <AnimatedView
      flex={1}
      bg="white"
      entering={SlideInLeft.duration(500).springify().damping(20)}
      exiting={SlideOutLeft}>
      {children}
    </AnimatedView>
  );
};
