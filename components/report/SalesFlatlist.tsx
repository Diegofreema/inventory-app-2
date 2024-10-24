/* eslint-disable prettier/prettier */

import * as Print from 'expo-print';
import { useState } from 'react';
import { FlatList, useWindowDimensions } from 'react-native';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';
import { MyButton } from '../ui/MyButton';
import { Empty } from '../ui/empty';
import { CustomSubHeading } from '../ui/typography';

import StoreSales from '~/db/model/StoreSale';
import { useGet } from '~/hooks/useGet';
import { useGetProductName } from '~/hooks/useGetProductName';
import { calculateTotalsByPaymentType } from '~/lib/helper';

type Props = {
  data: StoreSales[];
  scroll?: boolean;
};

export const SalesFlatList = ({ data, scroll = true }: Props): JSX.Element => {
  const dt = calculateTotalsByPaymentType(data);
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  return (
    <FlatList
      scrollEnabled={scroll}
      ListHeaderComponent={() => <CustomSubHeading text="Store Sales" fontSize={2.2} />}
      data={data}
      renderItem={({ item, index }) => <SalesCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No Sales for this date" />}
      ListFooterComponent={() =>
        data.length ? <BottomList data={dt} index={data?.length} /> : null
      }
      numColumns={isSmallTablet ? 2 : undefined}
      columnWrapperStyle={isSmallTablet && { gap: 20 }}
    />
  );
};

const SalesCard = ({ item, index }: { item: StoreSales; index: number }) => {
  const { worker } = useGet(item?.productId, item.userId!);
  const name = useGetProductName(item.productId);
  const [printing, setPrinting] = useState(false);

  const price = +item?.qty * +item?.unitPrice;
  const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
   
  <div style='width: 80%; margin: 0 auto;'>
    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Date
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ${item?.dateX}
      </h1>
    </div>
    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Product
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ${name}
      </h1>
    </div>
    
   <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Quantity
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ${item?.qty}
      </h1>
    </div>
     <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Price
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ₦${item?.unitPrice}
      </h1>
    </div>
     <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Payment Type
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ${item?.paymentType}
      </h1>
    </div>
  </div>
  </body>
</html>
`;
  const print = async () => {
    setPrinting(true);
    try {
      await Print.printAsync({
        html,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setPrinting(false);
    }
  };
  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={name} />
      <FlexText text="Quantity" text2={item?.qty.toString()} />
      <FlexText text="Date" text2={item?.dateX} />
      <FlexText text="Mode" text2={item?.paymentType} />
      {item?.transferInfo && <FlexText text="Transfer Info" text2={item?.transferInfo!} />}
      <FlexText text="Price" text2={`₦${price.toString()}`} />
      <FlexText text="Personnel" text2={worker?.name || 'Admin'} />
      <MyButton title="Print" onPress={print} loading={printing} disabled={printing} />
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
      <CustomSubHeading text="Sales summary" fontSize={2.2} />
      {data.map((d, i) => (
        <FlexText text={d.type} key={i} text2={`₦${d.value}`} />
      ))}
    </AnimatedCard>
  );
};
