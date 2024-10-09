/* eslint-disable prettier/prettier */
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { forwardRef, ForwardedRef, useMemo } from 'react';
import { StyleSheet } from 'react-native'; // Added import for Text and StyleSheet
import { Calendar, DateData } from 'react-native-calendars';

import { CustomSubHeading } from '../ui/typography';

import { colors } from '~/constants';
type Props = {
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  startDate: string;
  endDate: string;
};

export const CalenderSheet = forwardRef<BottomSheetMethods, Props>(
  (
    { endDate, setEndDate, setStartDate, startDate }: Props,
    ref: ForwardedRef<BottomSheetMethods>
  ) => {
    const handleSheetChanges = (index: number) => {
      // Handle sheet changes here
    };
    const snapPoints = useMemo(() => ['1%', '60%'], []);

    const onDayPress = (day: DateData) => {
      if (startDate && !endDate) {
        // If start date is selected and end date is not, set end date

        setEndDate(day.dateString);
      } else {
        // If no start date or both dates are set, reset and set new start date
        setStartDate(day.dateString);
        setEndDate('');
      }
    };

    const markedDates = {
      [startDate]: { startingDay: true, color: colors.green, textColor: 'white' },
      [endDate]: { endingDay: true, color: colors.green, textColor: 'white' },
    };

    if (startDate && endDate) {
      // Add dates between start and end
      let date = new Date(startDate);
      const end = new Date(endDate);
      while (date < end) {
        date = new Date(date.setDate(date.getDate() + 1));
        const dateString = date.toISOString().split('T')[0];
        if (dateString !== endDate) {
          markedDates[dateString] = { color: colors.green, textColor: 'white', endingDay: false };
        }
      }
    }
    return (
      <BottomSheet
        ref={ref}
        onChange={handleSheetChanges}
        index={-1}
        enablePanDownToClose
        snapPoints={snapPoints}>
        <BottomSheetView style={styles.contentContainer}>
          <CustomSubHeading
            text="Select a start date and end date"
            textAlign="center"
            fontSize={1.7}
          />
          <Calendar onDayPress={onDayPress} markedDates={markedDates} markingType="period" />
        </BottomSheetView>
      </BottomSheet>
    );
  }
);
const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
  },
});
CalenderSheet.displayName = 'CalenderSheet';
