/* eslint-disable prettier/prettier */

import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { format, isWithinInterval } from "date-fns";
import { useCallback, useMemo, useRef, useState } from "react";

import { CalenderSheet } from "./CalenderSheet";
import { SalesFlatlist } from "./SalesFlatlist";
import { StoreActions } from "../store/StoreActions";
import { AnimatedContainer } from "../ui/AniminatedContainer";
import { Error } from "../ui/Error";
import { ExpenseLoader } from "../ui/Loading";
import { PaginationButton } from "../ui/PaginationButton";

import { useRender } from "~/hooks/useRender";
import { formattedDate, totalAmount } from "~/lib/helper";
import { useSalesP } from "~/lib/tanstack/queries";
import { FlexText } from "~/components/ui/FlexText";

export const OnlinePharmacy = (): JSX.Element => {
  const [page, setPage] = useState(1);
  useRender();
  const { data, isPending, isError, refetch, isRefetching } = useSalesP(page);
  const handlePagination = useCallback((direction: 'next' | 'prev') => {
    setPage((prev) => prev + (direction === 'next' ? 1 : -1));
  }, []);

  const handleRefetch = useCallback(() => refetch(), []);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const isLoading = useMemo(() => isRefetching, [isRefetching]);

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
  const filterByDate = useMemo(() => {
    if (!startDate || !endDate || !data?.allData) return data?.data;

    const start = format(startDate, 'dd-MM-yyyy');
    const end = format(endDate, 'dd-MM-yyyy');

    return data.allData.filter((d) => {
      const salesDate = d.dateX.split(' ')[0].replace('/', '-').replace('/', '-');

      return isWithinInterval(salesDate, { start, end });
    });
  }, [data?.allData, startDate, endDate]);


  const resetDates = useCallback(() => {
    setEndDate('');
    setStartDate('');
  }, []);
  const isLastPage = useMemo(() => {
    if (!data?.count) return false;

    return data?.count <= page * 10;
  }, [data?.count, page]);

  const dataToRender = useMemo(() => {
    if (!dateValue) {
      return data?.data || [];
    } else {
      return filterByDate || [];
    }
  }, [dateValue, data?.data,filterByDate]);
  if (isError) return <Error onRetry={handleRefetch} />;
  const arrayOfNumbers = dataToRender.map((dt) => Math.round(dt.dealerShare) * dt.qty)
const totalCost = totalAmount(arrayOfNumbers)
  return (
    <AnimatedContainer>
      <StoreActions
        hide

        date
        onOpenCalender={onOpenCalender}
        dateValue={dateValue}
        resetDates={resetDates}
        showButton={false}
      />
      {isPending ? (
        <ExpenseLoader />
      ) : (
        <>
          <FlexText text="Total" text2={`₦${totalCost}`} />
          <SalesFlatlist
            // @ts-ignore
            data={dataToRender}
            isLoading={isLoading}
            refetch={handleRefetch}
            pagination={
              filterByDate?.length && !dateValue ? (
                <PaginationButton
                  page={page}
                  handlePagination={handlePagination}
                  isLastPage={isLastPage}
                />
              ) : (
                // @ts-ignore
                <></>
              )
            }
          />
        </>
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
