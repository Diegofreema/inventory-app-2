/* eslint-disable prettier/prettier */

import { router, usePathname } from 'expo-router';
import { FlatList, useWindowDimensions } from 'react-native';

import { ExpenseCard } from './ExpenseCard';
import { CustomPressable } from '../ui/CustomPressable';
import { Empty } from '../ui/empty';
import { CustomSubHeading } from '../ui/typography';

import Expenses from '~/db/model/Expenses';
import { FlashList } from '@shopify/flash-list';
import { View } from 'tamagui';

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
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;

  return (
    <View flex={1} mt={20}>
      <FlashList
        // @ts-ignore
        ListHeaderComponent={pathname === '/filterExpense' ? <></> : <Header />}
        data={data}
        onRefresh={refetch}
        refreshing={fetching}
        renderItem={({ item, index }) => <ExpenseCard item={item} index={index} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={() => <Empty text="No Expenses yet" />}
        ListFooterComponent={Pagination}
        numColumns={isSmallTablet ? 2 : undefined}
        estimatedItemSize={500}
      />
    </View>
  );
};

const Header = () => {
  return (
    <CustomPressable
      onPress={() => router.push('/filterExpense')}
      style={{
        padding: 10,
        borderWidth: 2,
        borderColor: '#ccc',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        marginBottom: 10,
      }}>
      <CustomSubHeading text="Filter by date" fontSize={1.6} />
    </CustomPressable>
  );
};
