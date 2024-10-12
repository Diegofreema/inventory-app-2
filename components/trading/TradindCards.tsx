/* eslint-disable prettier/prettier */

import { useWindowDimensions } from 'react-native';
import { Separator, Stack } from 'tamagui';

import { FlexText } from '../ui/FlexText';

import { AnimatedCard } from '~/components/ui/AnimatedCard';
import { CustomSubHeading } from '~/components/ui/typography';
import Expenses from '~/db/model/Expenses';
import { totalAmount } from '~/lib/helper';
import { GroupedExpense } from '~/type';
type Props = {
  data: {
    supply: number;
    disposal: number;
    onlineSales: number;
    offlineSales: number;
    expenses: Expenses[];
    openingStock: number;
    closingStock: number;
  };
};
export const TradingCards = ({ data }: Props) => {
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  const isBigTablet = width >= 700;
  const containerWidth = isBigTablet ? '70%' : isSmallTablet ? '80%' : '100%';
  const expenses = data?.expenses?.map((exp) => ({
    accountname: exp.accountName,
    amount: exp.amount,
  }));

  const groupedExpenses: GroupedExpense[] = Object.values(
    expenses.reduce((acc: any, expense: any) => {
      const key = expense.accountname.toLowerCase();
      if (!acc[key]) {
        acc[key] = { accountname: expense.accountname, amount: 0 };
      }
      acc[key].amount += Number(expense.amount);
      return acc;
    }, {})
  );
  const totalExpense = totalAmount(groupedExpenses.map((exp) => Number(exp.amount)));
  const credits = data?.onlineSales + data?.offlineSales + data?.closingStock;
  const debits = data.openingStock + data?.supply + data?.disposal + totalExpense;

  const profit = credits - debits;
  return (
    <Stack gap={15} width={containerWidth} mx="auto" flex={1}>
      <AnimatedCard index={1}>
        <CustomSubHeading text="Debit" fontSize={2.2} />
        <Separator backgroundColor="#ccc" />
        <FlexText text="Opening Stock" text2={`₦${data.openingStock?.toString()}`} />
        <FlexText text="Purchased Products" text2={`₦${data.supply?.toString()}`} />
        <FlexText text="Disposed Products" text2={`₦${data.disposal?.toString()}`} />
        {groupedExpenses?.map((expense, i) => (
          // @ts-ignore
          <FlexText key={i} text={expense?.accountname} text2={`₦${expense?.amount?.toString()}`} />
        ))}
      </AnimatedCard>
      <AnimatedCard index={2}>
        <CustomSubHeading text="Credit" fontSize={2.2} />
        <Separator backgroundColor="#ccc" />
        <FlexText text="Online Sales" text2={`₦${data.onlineSales?.toString()}`} />
        <FlexText text="Offline Sales" text2={`₦${data.offlineSales?.toString()}`} />
        <FlexText text="Closing stock" text2={`₦${data.closingStock?.toString()}`} />
      </AnimatedCard>
      <AnimatedCard index={3}>
        <FlexText text="Net profit" text2={`₦${profit?.toString()}`} />
      </AnimatedCard>
    </Stack>
  );
};
