/* eslint-disable prettier/prettier */

import { FlashList } from '@shopify/flash-list';
import { useWindowDimensions } from 'react-native';
import { View } from 'tamagui';

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
    <View flex={1} marginTop={20}>
      <FlashList
        data={data}
        onRefresh={onRefetch}
        refreshing={isFetching}
        renderItem={({ item, index }) => <ExpenditureCard item={item?.accountName} index={index} />}
        ListEmptyComponent={() => <Empty text="No Expenditure yet" />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={Pagination}
        numColumns={isSmallTablet ? 2 : undefined}
        estimatedItemSize={200}
      />
    </View>
  );
};
