/* eslint-disable prettier/prettier */

import { FlatList } from 'react-native';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';
import { Empty } from '../ui/empty';
import { CustomSubHeading } from '../ui/typography';

import SupplyProduct from '~/db/model/SupplyProduct';

type Props = {
  data: SupplyProduct[];
  scroll?: boolean;
};

export const ProductSupply = ({ data, scroll = true }: Props): JSX.Element => {
  return (
    <FlatList
      scrollEnabled={scroll}
      ListHeaderComponent={() => <CustomSubHeading text="Product Supply" fontSize={2.2} />}
      data={data}
      renderItem={({ item, index }) => <SupplyCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No Supply for this date" />}
    />
  );
};

const SupplyCard = ({ item, index }: { item: SupplyProduct; index: number }) => {
  const totalPrice = Number(item.unitCost) * Number(item?.qty);
  console.log(item.unitCost);

  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={item?.name} />
      <FlexText text="Date" text2={item?.dateX!} />
      <FlexText text="Quantity" text2={item?.qty.toString()} />
      <FlexText text="Cost" text2={'₦' + totalPrice.toString()} />
    </AnimatedCard>
  );
};
