/* eslint-disable prettier/prettier */

import { FlatList } from 'react-native';

import { ExpenseCard } from './ExpenseCard';
import { Empty } from '../ui/empty';

import { ExpType } from '~/type';

type Props = {
  data: ExpType[];
};

export const ExpenseFlalist = ({ data }: Props): JSX.Element => {
  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => <ExpenseCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 15, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No Expenses yet" />}
      style={{ marginTop: 20 }}
    />
  );
};
