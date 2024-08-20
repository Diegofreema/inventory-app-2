/* eslint-disable prettier/prettier */

import { FlatList } from 'react-native';

import { SalesCard } from './SalesCard';
import { Empty } from '../ui/empty';

import { CombinedStore } from '~/type';

type Props = {
  data: CombinedStore[];
  isLoading: boolean;
  refetch: () => void;
};

export const SalesFlatlist = ({ data, isLoading, refetch }: Props): JSX.Element => {
  return (
    <FlatList
      onRefresh={refetch}
      refreshing={isLoading}
      data={data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item, index }) => <SalesCard item={item} index={index} />}
      style={{ marginTop: 20 }}
      contentContainerStyle={{ paddingBottom: 20, gap: 20 }}
      ListEmptyComponent={() => <Empty text="No Sales yet" />}
      showsVerticalScrollIndicator={false}
    />
  );
};
