/* eslint-disable prettier/prettier */

import { FlatList } from 'react-native';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';
import { MyButton } from '../ui/MyButton';
import { Empty } from '../ui/empty';
import { CustomSubHeading } from '../ui/typography';

import { SalesS } from '~/db/schema';
import { useGet } from '~/hooks/useGet';
import { calculateTotalsByPaymentType } from '~/lib/helper';

type Props = {
  data: SalesS[];
  scroll?: boolean;
};

export const SalesFlatList = ({ data, scroll = true }: Props): JSX.Element => {
  const dt = calculateTotalsByPaymentType(data);

  return (
    <FlatList
      scrollEnabled={scroll}
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
  const { singleProduct, worker } = useGet(item?.productId, item.userId!);
  const price = +item?.qty * +item?.unitPrice;

  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={singleProduct?.product} />
      <FlexText text="Date" text2={item?.dateX} />
      <FlexText text="Mode" text2={item?.paymentType} />
      {item?.transferInfo && <FlexText text="Transfer Info" text2={item?.transferInfo!} />}
      <FlexText text="Price" text2={`₦${price.toString()}`} />
      <FlexText text="Personnel" text2={worker?.name || 'Admin'} />
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
