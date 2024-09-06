/* eslint-disable prettier/prettier */

import { FlatList } from 'react-native';

import { SalesCard } from './SalesCard';
import { Empty } from '../ui/empty';

import OnlineSale from '~/db/model/OnlineSale';
import StoreSales from '~/db/model/StoreSale';

type Props = {
  data: OnlineSale[] & StoreSales[];
  isLoading: boolean;
  refetch: () => void;
  pagination?: JSX.Element;
};

export const SalesFlatlist = ({
  data,
  isLoading,
  refetch,
  pagination: Pagination,
}: Props): JSX.Element => {
  return (
    <FlatList
      onRefresh={refetch}
      refreshing={isLoading}
      data={data}
      keyExtractor={(item, index) => item?.id}
      renderItem={({ item, index }) => <SalesCard item={item} index={index} />}
      style={{ marginTop: 20 }}
      contentContainerStyle={{ paddingBottom: 20, gap: 20 }}
      ListEmptyComponent={() => <Empty text="No Sales yet" />}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={Pagination}
    />
  );
};
