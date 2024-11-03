/* eslint-disable prettier/prettier */

import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Q } from '@nozbe/watermelondb';
import { withObservables } from '@nozbe/watermelondb/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { ScrollView } from 'tamagui';

import { Container } from './Container';
import { ExpenseFlatList } from './report/ExpenseFlatList';
import { ProductSupply } from './report/ProductSupply';
import { SalesFlatList } from './report/SalesFlatlist';
import { Disposal } from './report/disposal';
import { CalenderSheet } from './sales/CalenderSheet';
import { StoreActions } from './store/StoreActions';

import { disposedProducts, expenses, storeSales, supplyProduct } from '~/db';
import DisposedProducts from '~/db/model/DisposedProducts';
import Expenses from '~/db/model/Expenses';
import StoreSales from '~/db/model/StoreSale';
import SupplyProduct from '~/db/model/SupplyProduct';
import { useFilterData } from '~/hooks/useFilterData';
import { formattedDate } from '~/lib/helper';

type Props = {
  expense: Expenses[];
  productSupply: SupplyProduct[];
  storeSale: StoreSales[];
  disposal: DisposedProducts[];
};

const Report = ({ disposal, expense, productSupply, storeSale }: Props): JSX.Element => {
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
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  const isBigTablet = width >= 700;
  const containerWidth = isBigTablet ? '70%' : isSmallTablet ? '80%' : '100%';
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
        style={{ flex: 1, width: containerWidth, marginHorizontal: 'auto' }}>
        <StoreActions
          hide
          showButton={false}
          date
          onOpenCalender={onOpenCalender}
          dateValue={dateValue}
          resetDates={resetDates}
        />
        {dateValue && (
          // @ts-ignore
          <>
            <ProductSupply scroll={false} data={filterSupply} />
            <SalesFlatList scroll={false} data={filterData} />
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
};

const enhanced = withObservables([], () => ({
  expense: expenses.query(Q.sortBy('created_at', Q.desc)).observe(),
  productSupply: supplyProduct.query(Q.sortBy('created_at', Q.desc)).observe(),
  storeSale: storeSales.query(Q.sortBy('created_at', Q.desc)).observe(),
  disposal: disposedProducts.query(Q.sortBy('created_at', Q.desc)).observe(),
}));

const EnhancedReport = enhanced(Report);
export default EnhancedReport;
