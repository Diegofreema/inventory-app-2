/* eslint-disable prettier/prettier */

import { Q } from '@nozbe/watermelondb';
import { useEffect, useState } from 'react';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';

import { products, staffs } from '~/db';
import { trimText } from '~/lib/helper';
import { CombinedStore } from '~/type';

type Props = {
  item: CombinedStore;
  index: number;
};

export const SalesCard = ({ index, item }: Props): JSX.Element => {
  const price = item?.dealerShare ? item?.dealerShare : item?.unitPrice;
  const [staff, setStaff] = useState('');
  const [productName, setProductName] = useState('');

  useEffect(() => {
    const getStaff = async () => {
      const product = await products.query(Q.where('product_id', Q.eq(item.productId))).fetch();
      setProductName(product[0].product);

      if (!item.userId) return;
      const staff = await staffs.find(item.userId?.toString()!);

      setStaff(staff?.name!);
    };

    getStaff();
  }, [item?.userId, item.productId]);
  console.log(item.name);

  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={item.name} />
      <FlexText text="Date" text2={item?.dateX} />
      <FlexText text="Quantity" text2={item?.qty.toString()} />
      <FlexText text="Price" text2={`₦${price}`} />
      {item?.paid && <FlexText text="Paid" text2={item?.paid ? 'Yes' : 'No'} />}
      {item?.paymentType && <FlexText text="Payment type" text2={item?.paymentType} />}
      {item?.salesReference && (
        <FlexText text="Sale's reference" text2={trimText(item?.salesReference!)} />
      )}
      {item?.transferInfo && <FlexText text="Transaction info" text2={item?.transferInfo} />}
      {item?.userId && <FlexText text="Staff" text2={staff} />}
    </AnimatedCard>
  );
};
