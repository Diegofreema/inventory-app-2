/* eslint-disable prettier/prettier */

import { Separator, Stack } from 'tamagui';

import { FlexText } from '../ui/FlexText';

import { AnimatedCard } from '~/components/ui/AnimatedCard';
import { CustomSubHeading } from '~/components/ui/typography';
import { ExpType, GroupedExpense } from '~/type';
type Props = {
  data: {
    supply: number;
    disposal: number;
    onlineSales: number;
    offlineSales: number;
    expenses: ExpType[];
  };
};
export const TradingCards = ({ data }: Props) => {
  const totalCredit = data?.onlineSales + data?.offlineSales;
  const totalDebit = data?.supply + data?.disposal;
  const profit = totalCredit - totalDebit;
  const expenses = data?.expenses?.map((exp) => ({
    accountname: exp.accountname,
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

  return (
    <Stack gap={15}>
      <AnimatedCard index={1}>
        <CustomSubHeading text="Debit" fontSize={20} />
        <Separator bg="#ccc" />
        <FlexText text="Purchased Products" text2={`₦${data.supply?.toString()}`} />
        <FlexText text="Disposed Products" text2={`₦${data.disposal?.toString()}`} />
        {groupedExpenses?.map((expense, i) => (
          // @ts-ignore
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
