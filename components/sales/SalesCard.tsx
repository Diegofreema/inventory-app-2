/* eslint-disable prettier/prettier */

import { Q } from '@nozbe/watermelondb';
import { useEffect, useState } from 'react';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';

import { products, staffs } from '~/db';
import OnlineSale from '~/db/model/OnlineSale';
import StoreSales from '~/db/model/StoreSale';
import { trimText } from '~/lib/helper';

type Props = {
  item: OnlineSale & StoreSales;
  index: number;
};

export const SalesCard = ({ index, item }: Props): JSX.Element => {
  const price = item?.dealerShare ? item?.dealerShare : item?.unitPrice;
  const [productName, setProductName] = useState('');
  const [staff, setStaff] = useState('');
  console.log(item.productId);

  useEffect(() => {
    if (!item.userId) return;
    const getStaff = async () => {
      const staff = await staffs.find(item.userId?.toString()!);
      const product = await products
        .query(Q.where('product_id', item.productId), Q.take(1))
        .fetch();

      setProductName(product[0].product);
      setStaff(staff?.name!);
    };

    getStaff();
  }, [item?.userId, item.productId]);
  console.log(productName);

  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={trimText(productName, 20)} />
      <FlexText text="Date" text2={item?.dateX} />
      <FlexText text="Quantity" text2={item?.qty.toString()} />
      <FlexText text="Price" text2={`₦${price}`} />
      {item?.isPaid && <FlexText text="Paid" text2={item?.isPaid ? 'Yes' : 'No'} />}
      {item?.paymentType && <FlexText text="Payment type" text2={item?.paymentType} />}

      {item?.transferInfo && <FlexText text="Transaction info" text2={item?.transferInfo} />}
      {item?.userId && <FlexText text="Staff" text2={staff} />}
    </AnimatedCard>
  );
};
