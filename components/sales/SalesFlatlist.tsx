/* eslint-disable prettier/prettier */

import { FlatList, useWindowDimensions } from 'react-native';

import { SalesCard } from './SalesCard';
import { Empty } from '../ui/empty';

import OnlineSale from '~/db/model/OnlineSale';
import StoreSales from '~/db/model/StoreSale';
import { View } from "tamagui";
import { FlashList } from "@shopify/flash-list";

type Props = {
  data: OnlineSale[] & StoreSales[];
  isLoading: boolean;
  refetch: () => void;
  pagination?: JSX.Element;
  print?: boolean;
};

export const SalesFlatlist = ({
  data,
  isLoading,
  refetch,
  pagination: Pagination,
  print
}: Props) => {
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  return (
    <FlatList
      onRefresh={refetch}
      refreshing={isLoading}
      data={data}
      keyExtractor={(item,) => item?.id}
      renderItem={({ item, index }) =>  <SalesCard print={print} item={item} index={index} />}
      style={{ marginTop: 20 }}
      contentContainerStyle={{ paddingBottom: 20, gap: 20 }}
      ListEmptyComponent={() => <Empty text="No Sales yet" />}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={Pagination}
      columnWrapperStyle={isSmallTablet && { gap: 20 }}
      numColumns={isSmallTablet ? 2 : undefined}

    />
  );
};
