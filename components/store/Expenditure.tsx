/* eslint-disable prettier/prettier */

import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { ExpenditureList } from './ExpenditureList';
import { StoreActions } from './StoreActions';
import { AnimatedContainer } from '../ui/AniminatedContainer';
import { Error } from '../ui/Error';
import { ExpenditureLoader } from '../ui/Loading';
import { PaginationButton } from '../ui/PaginationButton';

import { useRender } from '~/hooks/useRender';
import { useExpAcc } from '~/lib/tanstack/queries';

export const Expenditure = (): JSX.Element => {
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const onSetValue = useCallback((val: string) => setValue(val), [value]);
  const { refetch, data, isError, isPending, isLoading: isRefetching } = useExpAcc(page);
  useRender();
  const handlePagination = useCallback((direction: 'next' | 'prev') => {
    setPage((prev) => prev + (direction === 'next' ? 1 : -1));
  }, []);

  const router = useRouter();
  const handleNav = () => {
    router.push('/addExpenditure');
  };
  const onRefetch = useCallback(() => refetch, []);
  const filterAccount = useMemo(() => {
    if (!value.trim()) {
      return data?.allData || [];
    }

    const lowerCaseValue = value.toLowerCase();
    return (
      data?.allData?.filter((d) => d?.accountName?.toLowerCase().includes(lowerCaseValue)) || []
    );
  }, [value, data?.allData]);
  const isLastPage = useMemo(() => {
    if (!filterAccount?.length) return false;

    return filterAccount?.length <= page * 10;
  }, [filterAccount, page]);
  const dataToRender = useMemo(() => {
    if (!value) {
      return data?.data || [];
    } else {
      return filterAccount;
    }
  }, [value, data?.data, filterAccount]);
  if (isError) {
    return <Error onRetry={refetch} />;
  }
  return (
    <AnimatedContainer>
      <StoreActions
        placeholder="expenditure name"
        title="Expenditure"
        setVal={onSetValue}
        val={value}
        onPress={handleNav}
      />

      {isPending ? (
        <ExpenditureLoader />
      ) : (
        <ExpenditureList
          onRefetch={onRefetch}
          isFetching={isRefetching}
          data={dataToRender}
          pagination={
            data.data.length && !value ? (
              <PaginationButton
                handlePagination={handlePagination}
                page={page}
                isLastPage={isLastPage}
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
