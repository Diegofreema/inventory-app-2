/* eslint-disable prettier/prettier */

import { eq } from 'drizzle-orm';
import { useEffect, useState } from 'react';

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';

import { useDrizzle } from '~/hooks/useDrizzle';
import { trimText } from '~/lib/helper';
import { CombinedStore } from '~/type';

type Props = {
  item: CombinedStore;
  index: number;
};

export const SalesCard = ({ index, item }: Props): JSX.Element => {
  const price = item?.dealerShare ? item?.dealerShare : item?.unitPrice;
  const [staff, setStaff] = useState('');
  const { db, schema } = useDrizzle();
  useEffect(() => {
    if (!item.userId) return;
    const getStaff = async () => {
      const staff = await db.query.staff.findFirst({
        where: eq(schema.staff.id, Number(item?.userId)),
        columns: {
          name: true,
        },
      });
      setStaff(staff?.name!);
    };

    getStaff();
  }, [item?.userId]);
  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={item?.product?.product} />
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
