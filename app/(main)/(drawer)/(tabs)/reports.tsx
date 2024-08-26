// /* eslint-disable prettier/prettier */

// import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
// import { useCallback, useMemo, useRef, useState } from 'react';

// import { Container } from '~/components/Container';
// import { ExpenseFlatList } from '~/components/report/ExpenseFlatList';
// import { ProductSupply } from '~/components/report/ProductSupply';
// import { SalesFlatList } from '~/components/report/SalesFlatlist';
// import { Disposal } from '~/components/report/disposal';
// import { CalenderSheet } from '~/components/sales/CalenderSheet';
// import { StoreActions } from '~/components/store/StoreActions';
// import { useFilterData } from '~/hooks/useFilterData';
// import { useReports } from '~/hooks/useReports';
// import { formattedDate } from '~/lib/helper';

// export default function Record() {
//   const { expense, productSupply, storeSales, disposal } = useReports();

//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const { filterData, filterExpense, filterSupply, filteredDisposal } = useFilterData({
//     endDate,
//     startDate,
//     expense,
//     productSupply,
//     storeSales,
//     disposal,
//   });
//   const bottomRef = useRef<BottomSheetMethods | null>(null);

//   const onOpenCalender = useCallback(() => {
//     if (!bottomRef?.current) return;

//     bottomRef.current.expand();
//   }, []);
//   const dateValue = useMemo(() => {
//     if (startDate && endDate) {
//       bottomRef?.current?.close();

//       return `${formattedDate(startDate)} to ${formattedDate(endDate)}`;
//     }
//     return '';
//   }, [startDate, endDate]);

//   const resetDates = useCallback(() => {
//     setEndDate('');
//     setStartDate('');
//   }, []);

//   return (
//     <Container>
//       <StoreActions
//         hide
//         date
//         onOpenCalender={onOpenCalender}
//         dateValue={dateValue}
//         resetDates={resetDates}
//       />
//       {dateValue && (
//         <>
//           <SalesFlatList data={filterData} />
//           <ProductSupply data={filterSupply} />
//           <ExpenseFlatList data={filterExpense} />
//           <Disposal data={filteredDisposal} />
//         </>
//       )}

//       <CalenderSheet
//         ref={bottomRef}
//         setEndDate={setEndDate}
//         endDate={endDate}
//         setStartDate={setStartDate}
//         startDate={startDate}
//       />
//     </Container>
//   );
// }
