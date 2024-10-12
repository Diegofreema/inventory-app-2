/* eslint-disable prettier/prettier */

import { FlatList, useWindowDimensions } from 'react-native';

import { ExpenditureCard } from '../ui/ExpenditureCard';
import { Empty } from '../ui/empty';

type Props = {
  data: { accountName: string }[];
  onRefetch: () => void;
  isFetching: boolean;
  pagination?: JSX.Element;
};

export const ExpenditureList = ({
  data,
  onRefetch,
  isFetching,
  pagination: Pagination,
}: Props): JSX.Element => {
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;

  return (
    <FlatList
      data={data}
      onRefresh={onRefetch}
      refreshing={isFetching}
      renderItem={({ item, index }) => <ExpenditureCard item={item?.accountName} index={index} />}
      style={{ marginTop: 10 }}
      ListEmptyComponent={() => <Empty text="No Expenditure yet" />}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={Pagination}
      columnWrapperStyle={isSmallTablet && { gap: 20 }}
      numColumns={isSmallTablet ? 2 : undefined}
    />
  );
};
