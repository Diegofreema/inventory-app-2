/* eslint-disable prettier/prettier */

import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native';

import { Container } from '~/components/Container';
import { ExpenseFlatList } from '~/components/report/ExpenseFlatList';
import { ProductSupply } from '~/components/report/ProductSupply';
import { SalesFlatList } from '~/components/report/SalesFlatlist';
import { Disposal } from '~/components/report/disposal';
import { CalenderSheet } from '~/components/sales/CalenderSheet';
import { StoreActions } from '~/components/store/StoreActions';
import { useFilterData } from '~/hooks/useFilterData';
import { useReports } from '~/hooks/useReports';
import { formattedDate } from '~/lib/helper';

export default function Record() {
  const { expense, productSupply, storeSale, disposal } = useReports();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { filterData, filterExpense, filterSupply, filteredDisposal } = useFilterData({
    endDate,
    startDate,
    expense,
    productSupply,
    storeSales: storeSale,
    disposal,
  });
  const bottomRef = useRef<BottomSheetMethods | null>(null);

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

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, gap: 20 }}
        style={{ flex: 1 }}>
        <StoreActions
          hide
          date
          onOpenCalender={onOpenCalender}
          dateValue={dateValue}
          resetDates={resetDates}
        />
        {dateValue && (
          // @ts-ignore
          <>
            <SalesFlatList scroll={false} data={filterData} />
            <ProductSupply scroll={false} data={filterSupply} />
            <ExpenseFlatList scroll={false} data={filterExpense} />
            <Disposal scroll={false} data={filteredDisposal} />
          </>
        )}
      </ScrollView>

      <CalenderSheet
        ref={bottomRef}
        setEndDate={setEndDate}
        endDate={endDate}
        setStartDate={setStartDate}
        startDate={startDate}
      />
    </Container>
  );
}
