/* eslint-disable prettier/prettier */

import { FlatList } from 'react-native';

import { AnimatedCard } from './ui/AnimatedCard';
import { FlexText } from './ui/FlexText';
import { Empty } from './ui/empty';

import { NotType } from '~/type';

type Props = {
  data: NotType[];
  isLoading: boolean;
  onRefetch: () => void;
};

export const Notifications = ({ data, isLoading, onRefetch }: Props): JSX.Element => {
  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => <NotificationCard item={item} index={index} />}
      contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No notification" />}
      refreshing={isLoading}
      onRefresh={onRefetch}
      showsVerticalScrollIndicator={false}
    />
  );
};

const NotificationCard = ({ index, item }: { item: NotType; index: number }) => {
  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={item?.productid} />
      <FlexText text="Dealer share" text2={item?.dealershare} />
      <FlexText text="Netpro share" text2={item?.netproshare} />
      <FlexText text="Date" text2={item?.datex} />
      <FlexText text="Unit price" text2={item?.unitprice} />
      <FlexText text="Quantity" text2={item?.qty} />
      <FlexText text="Sales reference" text2={item?.salesreference} />
    </AnimatedCard>
  );
};
