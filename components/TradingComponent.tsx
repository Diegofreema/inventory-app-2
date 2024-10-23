/* eslint-disable prettier/prettier */
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { withObservables } from '@nozbe/watermelondb/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { ScrollView, View } from 'tamagui';

import { Container } from '~/components/Container';
import { CalenderSheet } from '~/components/sales/CalenderSheet';
import { StoreActions } from '~/components/store/StoreActions';
import { TradingCards } from '~/components/trading/TradindCards';
import { disposedProducts, expenses, onlineSales, storeSales, supplyProduct } from '~/db';
import DisposedProducts from '~/db/model/DisposedProducts';
import Expenses from '~/db/model/Expenses';
import OnlineSale from '~/db/model/OnlineSale';
import StoreSales from '~/db/model/StoreSale';
import SupplyProduct from '~/db/model/SupplyProduct';
import { useRender } from '~/hooks/useRender';
import { useTrading } from '~/hooks/useTrading';
import { formattedDate } from '~/lib/helper';

type Props = {
  onlineSales: OnlineSale[];
  storeSales: StoreSales[];
  disposal: DisposedProducts[];
  expense: Expenses[];
  productSupply: SupplyProduct[];
};
const Trading = ({ disposal, expense, onlineSales, productSupply, storeSales }: Props) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const bottomRef = useRef<BottomSheetMethods | null>(null);
  useRender();

  const {
    memoizedDisposal,
    memoizedExpense,
    memoizedOfflineSales,
    memoizedOnlineSales,
    memoizedSupply,
    openingStock,
    closingStock,
  } = useTrading({ onlineSales, startDate, endDate, storeSales, disposal, expense, productSupply });

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
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  const isBigTablet = width >= 700;
  const containerWidth = isBigTablet ? '60%' : isSmallTablet ? '80%' : '100%';
  const data = {
    supply: memoizedSupply,
    disposal: memoizedDisposal,
    onlineSales: memoizedOnlineSales,
    offlineSales: memoizedOfflineSales,
    expenses: memoizedExpense,
    openingStock,
    closingStock,
  };
  const emptyDates = !startDate || !endDate;
  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}>
        <View width={containerWidth} mx="auto">
          <StoreActions
            hide
            date
            onOpenCalender={onOpenCalender}
            dateValue={dateValue}
            resetDates={resetDates}
          />
        </View>

        {!emptyDates && <TradingCards data={data} />}
      </ScrollView>
      <CalenderSheet
        ref={bottomRef}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        startDate={startDate}
        endDate={endDate}
      />
    </Container>
  );
};

const enhanced = withObservables([], () => ({
  onlineSales: onlineSales.query().observe(),
  storeSales: storeSales.query().observe(),
  disposal: disposedProducts.query().observe(),
  expense: expenses.query().observe(),
  productSupply: supplyProduct.query().observe(),
}));

const EnhancedTrading = enhanced(Trading);

export default EnhancedTrading;
