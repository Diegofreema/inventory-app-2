/* eslint-disable prettier/prettier */

import { FlatList } from 'react-native';

import { ExpenditureCard } from '../ui/ExpenditureCard';
import { Empty } from '../ui/empty';

type Props = {
  data: { accountname: string }[];
  onRefetch: () => void;
  isFetching: boolean;
};

export const ExpenditureList = ({ data, onRefetch, isFetching }: Props): JSX.Element => {
  return (
    <FlatList
      data={data}
      onRefresh={onRefetch}
      refreshing={isFetching}
      renderItem={({ item, index }) => <ExpenditureCard item={item?.accountname} index={index} />}
      style={{ marginTop: 10 }}
      ListEmptyComponent={() => <Empty text="No Expenditure yet" />}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  );
};
