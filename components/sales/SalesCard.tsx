/* eslint-disable prettier/prettier */

import { AnimatedCard } from '../ui/AnimatedCard';
import { FlexText } from '../ui/FlexText';

import { trimText } from '~/lib/helper';
import { CombinedStore } from '~/type';

type Props = {
  item: CombinedStore;
  index: number;
};

export const SalesCard = ({ index, item }: Props): JSX.Element => {
  const price = item?.dealershare ? item?.dealershare : item?.unitprice;
  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={item?.product?.product} />
      <FlexText text="Date" text2={item?.datex} />
      <FlexText text="Quantity" text2={item?.qty} />
      <FlexText text="Price" text2={`₦${price}`} />
      {item?.paid && <FlexText text="Paid" text2={item?.paid} />}
      {item?.paymenttype && <FlexText text="Payment type" text2={item?.paymenttype} />}
      {item?.salesreference && (
        <FlexText text="Sale's reference" text2={trimText(item?.salesreference)} />
      )}
      {item?.transinfo && <FlexText text="Transaction info" text2={item?.transinfo} />}
      {item?.userid && <FlexText text="Staff" text2="John" />}
    </AnimatedCard>
  );
};
