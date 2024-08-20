/* eslint-disable prettier/prettier */

import { FlatList } from 'react-native';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';
import { MyButton } from '../ui/MyButton';
import { Empty } from '../ui/empty';
import { CustomSubHeading } from '../ui/typography';

import { calculateTotalsByPaymentType } from '~/lib/helper';
import { SalesS } from '~/type';
type Props = {
  data: SalesS[];
};

export const SalesFlatList = ({ data }: Props): JSX.Element => {
  const dt = calculateTotalsByPaymentType(data);

  return (
    <FlatList
      ListHeaderComponent={() => <CustomSubHeading text="Store Sales" fontSize={20} />}
      data={data}
      renderItem={({ item, index }) => <SalesCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No Sales for this date" />}
      ListFooterComponent={() =>
        data.length ? <BottomList data={dt} index={data?.length} /> : null
      }
    />
  );
};

const SalesCard = ({ item, index }: { item: SalesS; index: number }) => {
  const price = +item?.qty * +item?.unitprice;

  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={`${item?.qty} ${item?.productid}`} />
      <FlexText text="Date" text2={item?.datex} />
      <FlexText text="Mode" text2={item?.paymenttype} />
      <FlexText text="Info" text2={item?.transinfo} />
      <FlexText text="Price" text2={`₦${price.toString()}`} />
      <FlexText text="Personnel" text2="John" />
      <MyButton title="Print" onPress={() => {}} />
    </AnimatedCard>
  );
};

const BottomList = ({
  data,
  index,
}: {
  index: number;
  data: {
    type: string;
    value: number;
  }[];
}) => {
  return (
    <AnimatedCard index={index}>
      <CustomSubHeading text="Sales summary" fontSize={20} />
      {data.map((d, i) => (
        <FlexText text={d.type} key={i} text2={`₦${d.value}`} />
      ))}
    </AnimatedCard>
  );
};
