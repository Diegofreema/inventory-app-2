/* eslint-disable prettier/prettier */
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { format, isWithinInterval, subDays } from 'date-fns';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Container } from '~/components/Container';
import { CalenderSheet } from '~/components/sales/CalenderSheet';
import { StoreActions } from '~/components/store/StoreActions';
import { TradingCards } from '~/components/trading/TradindCards';
import { useReports } from '~/hooks/useReports';
import { useTrading } from '~/hooks/useTrading';
import { formattedDate, totalAmount } from '~/lib/helper';

const TradingAccount = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const bottomRef = useRef<BottomSheetMethods | null>(null);
  const { onlineSales, storeSales, disposal, expense, productSupply } = useReports();
  const {
    memoizedDisposal,
    memoizedExpense,
    memoizedOfflineSales,
    memoizedOnlineSales,
    memoizedSupply,
    openningStock,
  } = useTrading({ onlineSales, startDate, endDate, storeSales, disposal, expense, productSupply });
  const onOpenCalender = useCallback(() => {
    if (!bottomRef?.current) return;

    bottomRef.current.expand();
  }, []);

  console.log({ productSupply });

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
  const data = {
    supply: memoizedSupply,
    disposal: memoizedDisposal,
    onlineSales: memoizedOnlineSales,
    offlineSales: memoizedOfflineSales,
    expenses: expense,
  };
  return (
    <Container>
      <StoreActions
        hide
        date
        onOpenCalender={onOpenCalender}
        dateValue={dateValue}
        resetDates={resetDates}
      />

      <TradingCards data={data} />
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

export default TradingAccount;
