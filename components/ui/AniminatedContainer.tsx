/* eslint-disable prettier/prettier */

import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { View } from 'tamagui';

const AnimatedView = Animated.createAnimatedComponent(View);
type Props = {
  children: React.ReactNode;
  width?: string;
};
export const AnimatedContainer = ({ children, width = '100%' }: Props): JSX.Element => {
  return (
    <AnimatedView
      flex={1}
      backgroundColor="white"
      entering={SlideInLeft.duration(500).springify().damping(20)}
      exiting={SlideOutLeft}
      style={{ marginHorizontal: 'auto', width }}>
      {children}
    </AnimatedView>
  );
};
