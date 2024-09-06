/* eslint-disable prettier/prettier */

import { FlatList } from 'react-native';

import { ExpenseCard } from './ExpenseCard';
import { Empty } from '../ui/empty';

import Expenses from '~/db/model/Expenses';

type Props = {
  data: Expenses[];
  fetching: boolean;
  refetch: () => void;
  pagination?: JSX.Element;
};

export const ExpenseFlalist = ({
  data,
  fetching,
  refetch,
  pagination: Pagination,
}: Props): JSX.Element => {
  return (
    <FlatList
      data={data}
      onRefresh={refetch}
      refreshing={fetching}
      renderItem={({ item, index }) => <ExpenseCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 15, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No Expenses yet" />}
      style={{ marginTop: 20 }}
      ListFooterComponent={Pagination}
    />
  );
};
