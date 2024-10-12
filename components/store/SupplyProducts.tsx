/* eslint-disable prettier/prettier */

import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { useCallback, useMemo, useRef, useState } from 'react';

import EnhancedSupply from './EnhancedSupply';
import { StoreActions } from './StoreActions';
import { CalenderSheet } from '../sales/CalenderSheet';
import { AnimatedContainer } from '../ui/AniminatedContainer';

import { formattedDate } from '~/lib/helper';

export const SupplyProducts = (): JSX.Element => {
  const [value, setValue] = useState('');

  const onSetValue = useCallback((val: string) => setValue(val), [value]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
    <AnimatedContainer>
      <StoreActions
        placeholder="Search by name"
        showButton={false}
        val={value}
        setVal={onSetValue}
        date
        onOpenCalender={onOpenCalender}
        dateValue={dateValue}
        resetDates={resetDates}
      />
      <EnhancedSupply value={value} startDate={startDate} endDate={endDate} />
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
