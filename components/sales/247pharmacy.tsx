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

import { formattedDate } from '~/lib/helper';
import { useSalesP } from '~/lib/tanstack/queries';

export const OnlinePharmacy = (): JSX.Element => {
  const { data, isPending, isError, refetch, isRefetching } = useSalesP();
  console.log({});

  const handleRefetch = useCallback(() => refetch(), []);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter();
  const isLoading = useMemo(() => isRefetching, [isRefetching]);
  const [value, setValue] = useState('');
  const bottomRef = useRef<BottomSheetMethods | null>(null);
  const onSetValue = useCallback((val: string) => setValue(val), [value]);
  const handleNav = useCallback(() => router.push('/addOnline'), [router]);

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
  const filterByDate = useMemo(() => {
    if (!startDate || !endDate || !data) return data;

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');

    return data.filter((d) => {
      const salesDate = d.datex.split(' ')[0].replace('/', '-').replace('/', '-');
      console.log({ salesDate });

      return isWithinInterval(salesDate, { start, end });
    });
  }, [data, startDate, endDate]);

  const filterAccount = useMemo(() => {
    if (!value.trim()) {
      return filterByDate || [];
    }
    const lowerCaseValue = value.toLowerCase();
    return (
      filterByDate?.filter((d) =>
        d.product?.product?.toString().toLowerCase().includes(lowerCaseValue)
      ) || []
    );
  }, [value, filterByDate]);
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
        <SalesFlatlist data={filterAccount} isLoading={isLoading} refetch={handleRefetch} />
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
