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

  const isLastPage = useMemo(() => {
    if (!data?.count) return false;

    return data?.count <= page * 10;
  }, [data?.count, page]);
  const filteredValue = useMemo(() => {
    if (!value.trim()) {
      return data?.data || [];
    }

    const lowerCaseValue = value.toLowerCase();

    return (
      data?.data?.filter((d) => {
        return (
          d.accountName.toLowerCase().includes(lowerCaseValue) ||
          d.amount.toString().toLowerCase().includes(lowerCaseValue)
        );
      }) || []
    );
  }, [value, data?.data]);
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
          data={filteredValue}
          fetching={isRefetching}
          refetch={refetch}
          pagination={
            data?.data?.length ? (
              <PaginationButton
                page={page}
                isLastPage={isLastPage}
                handlePagination={handlePagination}
              />
            ) : (
              <></>
            )
          }
        />
      )}
    </AnimatedContainer>
  );
};
