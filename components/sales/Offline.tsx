/* eslint-disable prettier/prettier */

import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { format, isWithinInterval } from 'date-fns';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';

import { CalenderSheet } from './CalenderSheet';
import { SalesFlatlist } from './SalesFlatlist';
import { StoreActions } from '../store/StoreActions';
import { AnimatedContainer } from '../ui/AniminatedContainer';
import { Error } from '../ui/Error';
import { ExpenseLoader } from '../ui/Loading';
import { PaginationButton } from '../ui/PaginationButton';

import { useRender } from '~/hooks/useRender';
import { formattedDate } from '~/lib/helper';
import { useSalesS } from '~/lib/tanstack/queries';

export const Offline = (): JSX.Element => {
  const [page, setPage] = useState(1);
  const { data, isPending, isError, refetch, isRefetching } = useSalesS(page);
  const handleRefetch = useCallback(() => refetch(), []);
  useRender();
  const handlePagination = useCallback((direction: 'next' | 'prev') => {
    setPage((prev) => prev + (direction === 'next' ? 1 : -1));
  }, []);

  const isLastPage = useMemo(() => {
    if (!data?.count) return false;

    return data?.count <= page * 10;
  }, [data?.count, page]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const bottomRef = useRef<BottomSheetMethods | null>(null);
  const router = useRouter();
  const isLoading = useMemo(() => isRefetching, [isRefetching]);
  const [value, setValue] = useState('');
  const onSetValue = useCallback((val: string) => setValue(val), [value]);
  const handleNav = useCallback(() => router.push('/addOfflineScreen'), [router]);
  const filterByDate = useMemo(() => {
    if (!startDate || !endDate || !data?.data) return data?.data;

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');

    return data.data.filter((d) => {
      const salesDate = d.dateX.split(' ')[0].replace('/', '-').replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });
  }, [data?.data, startDate, endDate]);
  const filterSales = useMemo(() => {
    if (!value.trim()) {
      return filterByDate || [];
    }
    const lowerCaseValue = value.toLowerCase();

    return (
      filterByDate?.filter((d) =>
        // @ts-ignore
        d?.name?.toString().toLowerCase().includes(lowerCaseValue)
      ) || []
    );
  }, [value, filterByDate]);
  const onOpenCalender = useCallback(() => {
    if (!bottomRef?.current) return;

    bottomRef.current.expand();
  }, []);
  const dateValue = useMemo(() => {
    if (startDate && endDate) {
      bottomRef?.current?.close();

      return `${formattedDate(startDate)} to ${formattedDate(endDate)}`;
    }
    return '';
  }, [startDate, endDate]);
  const resetDates = useCallback(() => {
    setEndDate('');
    setStartDate('');
  }, []);
  if (isError) return <Error onRetry={handleRefetch} />;

  return (
    <AnimatedContainer>
      <StoreActions
        placeholder="by name of product"
        title="sales"
        setVal={onSetValue}
        val={value}
        onPress={handleNav}
        date
        onOpenCalender={onOpenCalender}
        dateValue={dateValue}
        resetDates={resetDates}
      />
      {isPending ? (
        <ExpenseLoader />
      ) : (
        <SalesFlatlist
          // @ts-ignore
          data={filterSales}
          isLoading={isLoading}
          refetch={handleRefetch}
          pagination={
            data?.data.length ? (
              <PaginationButton
                isLastPage={isLastPage}
                handlePagination={handlePagination}
                page={page}
              />
            ) : (
              <></>
            )
          }
        />
      )}
      <CalenderSheet
        ref={bottomRef}
        setEndDate={setEndDate}
        endDate={endDate}
        setStartDate={setStartDate}
        startDate={startDate}
      />
    </AnimatedContainer>
  );
};
