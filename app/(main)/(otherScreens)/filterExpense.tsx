/* eslint-disable prettier/prettier */

import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { X } from '@tamagui/lucide-icons';
import { format, isWithinInterval } from 'date-fns';
import { useCallback, useMemo, useRef, useState } from 'react';
import { Input, XStack } from 'tamagui';

import { Container } from '~/components/Container';
import { CalenderSheet } from '~/components/sales/CalenderSheet';
import { ExpenseFlalist } from '~/components/store/ExpenseFlalist';
import { CustomPressable } from '~/components/ui/CustomPressable';
import { Error } from '~/components/ui/Error';
import { ExpenseLoader } from '~/components/ui/Loading';
import { NavHeader } from '~/components/ui/NavHeader';
import { colors } from '~/constants';
import { formattedDate } from '~/lib/helper';
import { useExpenditure } from '~/lib/tanstack/queries';

const FilterExpense = (): JSX.Element => {
  const { data, isPending, isError, refetch, isRefetching } = useExpenditure();
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
  const filterByData = useMemo(() => {
    if (!startDate || !endDate) return data?.allData || [];
    if (!data?.allData) return [];
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
  if (isError) {
    return <Error onRetry={refetch} />;
  }

  return (
    <Container>
      <NavHeader title="Filter Expense" />
      <XStack>
        <XStack
          alignItems="center"
          borderWidth={1}
          borderColor={colors.lightGray}
          borderRadius={10}
          flex={1}>
          <CustomPressable onPress={onOpenCalender} style={{ height: 50 }}>
            <Input
              editable={false}
              backgroundColor="$colorTransparent"
              borderWidth={0}
              fontSize={15}
              style={{ fontFamily: 'InterBold', color: 'black' }}
              placeholder="Filter eg. (07/25/2015 to 12/25/2015)"
              placeholderTextColor={colors.lightGray}
              height={50}
              flex={1}
              value={dateValue}
            />
          </CustomPressable>
          {dateValue && (
            <CustomPressable onPress={resetDates} style={{ flex: 0 }}>
              <X color="black" size={25} />
            </CustomPressable>
          )}
        </XStack>
      </XStack>
      {isPending ? (
        <ExpenseLoader />
      ) : (
        <ExpenseFlalist data={filterByData} fetching={isRefetching} refetch={refetch} />
      )}
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

export default FilterExpense;
