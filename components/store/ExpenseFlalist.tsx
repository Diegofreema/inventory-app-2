/* eslint-disable prettier/prettier */

import { router, usePathname } from 'expo-router';
import { FlatList, useWindowDimensions } from 'react-native';

import { ExpenseCard } from './ExpenseCard';
import { CustomPressable } from '../ui/CustomPressable';
import { Empty } from '../ui/empty';
import { CustomSubHeading } from '../ui/typography';

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
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;

  return (
    <FlatList
      // @ts-ignore
      ListHeaderComponent={pathname === '/filterExpense' ? <></> : <Header />}
      data={data}
      onRefresh={refetch}
      refreshing={fetching}
      renderItem={({ item, index }) => <ExpenseCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 15, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No Expenses yet" />}
      style={{ marginTop: 20 }}
      ListFooterComponent={Pagination}
      columnWrapperStyle={isSmallTablet && { gap: 20 }}
      numColumns={isSmallTablet ? 2 : undefined}
    />
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
      }}>
      <CustomSubHeading text="Filter by date" fontSize={1.6} />
    </CustomPressable>
  );
};
