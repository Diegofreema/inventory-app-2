/* eslint-disable prettier/prettier */

import { FlatList, useWindowDimensions } from 'react-native';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';
import { Empty } from '../ui/empty';
import { CustomSubHeading } from '../ui/typography';

import Expenses from '~/db/model/Expenses';

type Props = {
  data: Expenses[];
  scroll?: boolean;
};

export const ExpenseFlatList = ({ data, scroll = true }: Props): JSX.Element => {
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  return (
    <FlatList
      scrollEnabled={scroll}
      ListHeaderComponent={() => <CustomSubHeading text="Expense" fontSize={2.2} />}
      data={data}
      renderItem={({ item, index }) => <ExpenseCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No Expense for this date" />}
      columnWrapperStyle={isSmallTablet && { gap: 20 }}
      numColumns={isSmallTablet ? 2 : undefined}
    />
  );
};

const ExpenseCard = ({ item, index }: { item: Expenses; index: number }) => {
  return (
    <AnimatedCard index={index}>
      <FlexText text="Expense" text2={item?.accountName} />
      <FlexText text="Date" text2={item?.dateX} />
      <FlexText text="Amount" text2={'₦' + item?.amount} />
      {item?.description && <FlexText text="Description" text2={item?.description} />}
    </AnimatedCard>
  );
};
