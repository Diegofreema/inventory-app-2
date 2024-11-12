/* eslint-disable prettier/prettier */

import { useCallback, useState } from "react";

import EnhancedSupply from "./EnhancedSupply";
import { StoreActions } from "./StoreActions";
import { CalenderSheet } from "../sales/CalenderSheet";
import { AnimatedContainer } from "../ui/AniminatedContainer";

import { useCalendar } from "~/hooks/useCalendar";

export const SupplyProducts = (): JSX.Element => {
  const [value, setValue] = useState('');

  const onSetValue = useCallback((val: string) => setValue(val), [value]);

 const {endDate,setEndDate,setStartDate,startDate,resetDates,dateValue,onOpenCalender,bottomRef} = useCalendar()
  return (
    <AnimatedContainer>
      <StoreActions
        placeholder="Search by name"
        showButton={false}
        hide
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
