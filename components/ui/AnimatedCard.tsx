/* eslint-disable prettier/prettier */

import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { Card, CardHeader } from 'tamagui';

import { colors } from '~/constants';
type Props = {
  children: React.ReactNode;
  index: number;
};
const AnimatedComponent = Animated.createAnimatedComponent(Card);
export const AnimatedCard = ({ children, index }: Props): JSX.Element => {
  const getSlideDirection = (index: number) => {
    const baseAnimation = index % 2 === 0 ? SlideInLeft : SlideInRight;
    return baseAnimation.springify().damping(25);
  };

  const SlideDirection = getSlideDirection(index);
  return (
    <AnimatedComponent
      bg="white"
      borderWidth={1}
      borderColor={colors.lightGray}
      borderRadius={10}
      entering={SlideDirection}>
      <CardHeader gap={5}>{children}</CardHeader>
    </AnimatedComponent>
  );
};
