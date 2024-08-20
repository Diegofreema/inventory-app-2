/* eslint-disable prettier/prettier */
import { FlatList } from 'react-native';

import { AnimatedCard } from '~/components/ui/AnimatedCard';
import { FlexText } from '~/components/ui/FlexText';
import { Empty } from "~/components/ui/empty";
import { SupplyType } from '~/type';

type Props = {
  data: SupplyType[];
};
export const Disposal = ({ data }: Props) => {
  console.log(data);
  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => <DisposalCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text='No disposal for this date' />}
    />
  );
};

const DisposalCard = ({ index, item }: { item: SupplyType; index: number }) => {
  const cost = Number(item?.unitcost) * Number(item?.qty)
  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={item?.productid} />
      <FlexText text="Date" text2={item?.datex} />
      <FlexText text="Quantity" text2={item?.qty} />
      <FlexText text="Cost" text2={`₦${ cost.toString()}`} />
    </AnimatedCard>
  );
};
