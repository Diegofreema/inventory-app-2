/* eslint-disable prettier/prettier */

import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { ExpenseFlalist } from './ExpenseFlalist';
import { StoreActions } from './StoreActions';
import { AnimatedContainer } from '../ui/AniminatedContainer';
import { Error } from '../ui/Error';
import { ExpenseLoader } from '../ui/Loading';
import { PaginationButton } from '../ui/PaginationButton';

import { useRender } from '~/hooks/useRender';
import { useExpenditure } from '~/lib/tanstack/queries';

export const Expenses = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, refetch, isRefetching } = useExpenditure(page);
  const [value, setValue] = useState('');
  useRender();
  const router = useRouter();
  const handlePress = useCallback(() => router.push('/addExpense'), [router]);
  const onSetValue = useCallback((val: string) => setValue(val), [value]);
  const handlePagination = useCallback((direction: 'next' | 'prev') => {
    setPage((prev) => prev + (direction === 'next' ? 1 : -1));
  }, []);

  const filteredValue = useMemo(() => {
    if (!value.trim()) {
      return data?.allData || [];
    }

    const lowerCaseValue = value.toLowerCase();

    return (
      data?.allData?.filter((d) => {
        return (
          d.accountName.toLowerCase().includes(lowerCaseValue) ||
          d.amount.toString().toLowerCase().includes(lowerCaseValue)
        );
      }) || []
    );
  }, [value, data?.allData]);
  const isLastPage = useMemo(() => {
    if (!filteredValue?.length) return false;

    return filteredValue?.length <= page * 10;
  }, [filteredValue, page]);
  const dataToRender = useMemo(() => {
    if (!value) {
      return data?.data || [];
    } else {
      return filteredValue;
    }
  }, [value, data?.data, filteredValue]);
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
      {isPending ? (
        <ExpenseLoader />
      ) : (
        <ExpenseFlalist
          data={dataToRender}
          fetching={isRefetching}
          refetch={refetch}
          pagination={
            filteredValue?.length && !value ? (
              <PaginationButton
                page={page}
                isLastPage={isLastPage}
                handlePagination={handlePagination}
              />
            ) : (
              // @ts-ignore
              <></>
            )
          }
        />
      )}
    </AnimatedContainer>
  );
};
