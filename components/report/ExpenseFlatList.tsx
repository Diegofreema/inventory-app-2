/* eslint-disable prettier/prettier */

import { FlatList } from 'react-native';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';
import { Empty } from '../ui/empty';
import { CustomSubHeading } from '../ui/typography';

import { ExpType } from '~/type';

type Props = {
  data: ExpType[];
};

export const ExpenseFlatList = ({ data }: Props): JSX.Element => {
  return (
    <FlatList
      ListHeaderComponent={() => <CustomSubHeading text="Expense" fontSize={20} />}
      data={data}
      renderItem={({ item, index }) => <ExpenseCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No Expense for this date" />}
    />
  );
};

const ExpenseCard = ({ item, index }: { item: ExpType; index: number }) => {
  return (
    <AnimatedCard index={index}>
      <FlexText text="Expense" text2={item?.accountname} />
      <FlexText text="Date" text2={item?.datex} />
      <FlexText text="Amount" text2={'₦' + item?.amount} />
      {item?.descript && <FlexText text="Description" text2={item?.descript} />}
    </AnimatedCard>
  );
};
