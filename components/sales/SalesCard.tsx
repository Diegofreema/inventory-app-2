/* eslint-disable prettier/prettier */

import { useEffect, useState } from 'react';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';

import { staffs } from '~/db';
import OnlineSale from '~/db/model/OnlineSale';
import StoreSales from '~/db/model/StoreSale';
import { useGetProductName } from '~/hooks/useGetProductName';
import { trimText } from '~/lib/helper';
import { Separator } from "tamagui";
import { MyButton } from "~/components/ui/MyButton";
import { router } from "expo-router";

type Props = {
  item: OnlineSale & StoreSales;
  index: number;
  print?: boolean;
};

export const SalesCard = ({ index, item , print}: Props): JSX.Element => {
  const price = item?.dealerShare ? item?.dealerShare : item?.unitPrice;

  const productName = useGetProductName(item?.productId);
  const [staff, setStaff] = useState('');


  useEffect(() => {
    if (!item.userId) return;
    const getStaff = async () => {
      const staff = await staffs.find(item.userId?.toString()!);

      setStaff(staff?.name!);
    };

    getStaff();
  }, [item?.userId, item.productId]);
  console.log(item.productId);
const total = item?.qty * Math.round(price);
  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={trimText(productName || '', 20)} />
      <FlexText text="Date" text2={item?.dateX} />
      <FlexText text="Quantity" text2={item?.qty.toString()} />
      <FlexText text="Unit Price" text2={`₦${Math.round(price)}`} />
      {item?.isPaid && <FlexText text="Paid" text2={item?.isPaid ? 'Yes' : 'No'} />}
      {item?.paymentType && <FlexText text="Payment type" text2={item?.paymentType} />}

      {item?.transferInfo && <FlexText text="Transaction info" text2={item?.transferInfo} />}
      {item?.userId && <FlexText text="Staff" text2={staff} />}
      <Separator my={2} />
      <FlexText text="Total" text2={`₦${total}`} />
      {print && <Separator my={2} />}
      {
       print && <MyButton
          title="Print"
          height={50}
          onPress={() => router.push(`/print?ref=${item.salesReference}`)}
        />
      }
    </AnimatedCard>
  );
};
