/* eslint-disable prettier/prettier */
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useCallback, useMemo, useRef, useState } from 'react';

import { Container } from '~/components/Container';
import { CalenderSheet } from '~/components/sales/CalenderSheet';
import { StoreActions } from '~/components/store/StoreActions';
import { TradingCards } from '~/components/trading/TradindCards';
import { useRefetchProduct } from '~/hooks/useRefetchProduct';
import { useReports } from '~/hooks/useReports';
import { formattedDate, totalAmount } from '~/lib/helper';

const TradingAccount = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const bottomRef = useRef<BottomSheetMethods | null>(null);
  const { onlineSales, storeSales, disposal, expense } = useReports();
  const products = useRefetchProduct();

  const memoizedOnlineSales = useMemo(() => {
    if (!onlineSales) return 0;
    const numbers = onlineSales?.map((sale) => Number(sale?.unitprice));
    return totalAmount(numbers);
  }, [onlineSales]);
  const memoizedOfflineSales = useMemo(() => {
    if (!storeSales) return 0;
    const numbers = storeSales?.map((sale) => Number(sale?.unitprice));
    return totalAmount(numbers);
  }, [storeSales]);
  const memoizedDisposal = useMemo(() => {
    if (!disposal) return 0;
    const numbers = disposal?.map((d) => Number(d?.unitcost));
    return totalAmount(numbers);
  }, [disposal]);

  const memoizedProducts = useMemo(() => {
    if (!products) return 0;
    const numbers = products?.map((p) => Number(p?.sellingprice));
    return totalAmount(numbers);
  }, [products]);
  const onOpenCalender = useCallback(() => {
    if (!bottomRef?.current) return;

    bottomRef.current.expand();
  }, []);
  const memoizedExpense = useMemo(() => expense, [expense]);
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
    products: memoizedProducts,
    disposal: memoizedDisposal,
    onlineSales: memoizedOnlineSales,
    offlineSales: memoizedOfflineSales,
    expenses: memoizedExpense,
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
