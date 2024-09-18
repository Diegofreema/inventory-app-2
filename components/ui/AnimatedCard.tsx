/* eslint-disable prettier/prettier */

import { StyleProp, ViewStyle } from 'react-native';
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { Card, CardHeader } from 'tamagui';

import { colors } from '~/constants';
type Props = {
  children: React.ReactNode;
  index: number;
  style?: StyleProp<ViewStyle>;
};
const AnimatedComponent = Animated.createAnimatedComponent(Card);
export const AnimatedCard = ({ children, index, style }: Props): JSX.Element => {
  const getSlideDirection = (index: number) => {
    const baseAnimation = index % 2 === 0 ? SlideInLeft : SlideInRight;
    return baseAnimation.springify().damping(25);
  };

  const SlideDirection = getSlideDirection(index);
  return (
    <AnimatedComponent
      backgroundColor="white"
      borderWidth={1}
      borderColor={colors.lightGray}
      borderRadius={10}
      entering={SlideDirection}
      style={style}>
      <CardHeader gap={5}>{children}</CardHeader>
    </AnimatedComponent>
  );
};
