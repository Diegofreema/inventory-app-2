/* eslint-disable prettier/prettier */

import { FlatList } from 'react-native';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';
import { Empty } from '../ui/empty';
import { CustomSubHeading } from '../ui/typography';

import { SupplyType } from '~/type';

type Props = {
  data: SupplyType[];
};

export const ProductSupply = ({ data }: Props): JSX.Element => {
  return (
    <FlatList
      ListHeaderComponent={() => <CustomSubHeading text="Product Supply" fontSize={20} />}
      data={data}
      renderItem={({ item, index }) => <SupplyCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No Supply for this date" />}
    />
  );
};

const SupplyCard = ({ item, index }: { item: SupplyType; index: number }) => {
  const totalPrice = Number(item.unitcost) * Number(item?.qty);
  return (
    <AnimatedCard index={index}>
      <FlexText text="Date" text2={item?.datex} />
      <FlexText text="Product" text2={item?.productid} />
      <FlexText text="Quantity" text2={item?.qty} />
      <FlexText text="Cost" text2={'₦' + totalPrice.toString()} />
    </AnimatedCard>
  );
};
