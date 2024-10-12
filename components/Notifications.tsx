/* eslint-disable prettier/prettier */

import { router } from 'expo-router';
import { FlatList } from 'react-native';

import { AnimatedCard } from './ui/AnimatedCard';
import { FlexText } from './ui/FlexText';
import { MyButton } from './ui/MyButton';

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
      refreshing={isLoading}
      onRefresh={onRefetch}
      showsVerticalScrollIndicator={false}
    />
  );
};

const NotificationCard = ({ index, item }: { item: NotType; index: number }) => {
  return (
    <AnimatedCard index={index}>
      <FlexText text="Quantity" text2={item?.Products} />
      <FlexText text="Date" text2={item?.Datex} />
      <MyButton
        title="View"
        onPress={() => router.push(`/receipt1?ref=${item.salesreference}`)}
        mt={20}
      />
    </AnimatedCard>
  );
};
