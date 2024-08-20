/* eslint-disable prettier/prettier */

import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { ExpenseFlalist } from './ExpenseFlalist';
import { StoreActions } from './StoreActions';
import { AnimatedContainer } from '../ui/AniminatedContainer';
import { Error } from '../ui/Error';
import { ExpenseLoader } from '../ui/Loading';

import { useExpenditure } from '~/lib/tanstack/queries';

export const Expenses = (): JSX.Element => {
  const { data, isPending, isError, refetch } = useExpenditure();
  const [value, setValue] = useState('');
  const router = useRouter();
  const handlePress = useCallback(() => router.push('/addExpense'), [router]);
  const onSetValue = useCallback((val: string) => setValue(val), [value]);
  const filteredValue = useMemo(() => {
    if (!value.trim()) {
      return data || [];
    }

    const lowerCaseValue = value.toLowerCase();

    return (
      data?.filter((d) => {
        return (
          d.accountname.toLowerCase().includes(lowerCaseValue) ||
          d.amount.toString().toLowerCase().includes(lowerCaseValue)
        );
      }) || []
    );
  }, [value, data]);
  if (isError) {
    return <Error onRetry={refetch} />;
  }
  return (
    <AnimatedContainer>
      <StoreActions
        placeholder="Search by amount, name"
        title="Expense"
        onPress={handlePress}
        val={value}
        setVal={onSetValue}
      />
      {isPending ? <ExpenseLoader /> : <ExpenseFlalist data={filteredValue} />}
    </AnimatedContainer>
  );
};
