/* eslint-disable prettier/prettier */

import { Separator, Stack } from 'tamagui';

import { FlexText } from '../ui/FlexText';

import { AnimatedCard } from '~/components/ui/AnimatedCard';
import { CustomSubHeading } from '~/components/ui/typography';
import { ExpType } from '~/type';
type Props = {
  data: {
    products: number;
    disposal: number;
    onlineSales: number;
    offlineSales: number;
    expenses: ExpType[];
  };
};
export const TradingCards = ({ data }: Props) => {
  console.log(data.expenses);
  const totalCredit = data?.onlineSales + data?.offlineSales;
  const totalDebit = data?.products + data?.disposal;
  const profit = totalCredit - totalDebit;
  return (
    <Stack gap={15}>
      <AnimatedCard index={1}>
        <CustomSubHeading text="Debit" fontSize={20} />
        <Separator bg="#ccc" />
        <FlexText text="Products" text2={`₦${data.products?.toString()}`} />
        <FlexText text="Disposal" text2={`₦${data.disposal?.toString()}`} />
        {data?.expenses?.map((expense, i) => (
          <FlexText key={i} text={expense?.accountname} text2={`₦${expense?.amount}`} />
        ))}
      </AnimatedCard>
      <AnimatedCard index={2}>
        <CustomSubHeading text="Credit" fontSize={20} />
        <Separator bg="#ccc" />
        <FlexText text="Online Sales" text2={`₦${data.onlineSales?.toString()}`} />
        <FlexText text="Offline Sales" text2={`₦${data.offlineSales?.toString()}`} />
      </AnimatedCard>
      <AnimatedCard index={3}>
        <FlexText text="Net profit" text2={`₦${profit?.toString()}`} />
      </AnimatedCard>
    </Stack>
  );
};
