/* eslint-disable prettier/prettier */

import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated';
import { CardHeader, Card } from 'tamagui';

import { FlexText } from '../ui/FlexText';

import { colors } from '~/constants';
import { ExpType } from '~/type';

type Props = {
  item: ExpType;
  index: number;
};

const AnimatedCard = Animated.createAnimatedComponent(Card);
export const ExpenseCard = ({ index, item }: Props): JSX.Element => {
  const getSlideDirection = (index: number) => {
    const baseAnimation = index % 2 === 0 ? SlideInLeft : SlideInRight;
    return baseAnimation.springify().damping(25);
  };

  const SlideDirection = getSlideDirection(index);
  return (
    <AnimatedCard
      entering={SlideDirection}
      bg="white"
      borderWidth={1}
      borderColor={colors.lightGray}>
      <CardHeader gap={5}>
        <FlexText text="Account name" text2={item?.accountname} />
        <FlexText text="Description" text2={item?.descript} />
        <FlexText text="Amount" text2={item?.amount} />
        <FlexText text="Date" text2={item?.datex} />
      </CardHeader>
    </AnimatedCard>
  );
};
