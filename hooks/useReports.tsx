/* eslint-disable prettier/prettier */

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { getDisposal, getExpenditure, getInfo, getSale, getSalesP } from '~/lib/helper';
import { useStore } from '~/lib/zustand/useStore';
import { ExpType, SalesP, SalesS, SupplyType } from '~/type';

export const useReports = () => {
  const id = useStore((state) => state.id);
  const [storeSales, setStoreSales] = useState<SalesS[]>([]);
  const [onlineSales, setOnlineSales] = useState<SalesP[]>([]);
  const [productSupply, setProductSupply] = useState<SupplyType[]>([]);
  const [expense, setExpense] = useState<ExpType[]>([]);
  const [disposal, setDisposal] = useState<SupplyType[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const getData = async () => {
      if (!id) return;
      try {
        const [store, supply, expenseData, disposalData, sales] = await Promise.all([
          queryClient.fetchQuery({
            queryKey: ['salesStore', id],
            queryFn: () => getSale(id), // Changed to getSalesS
          }),
          queryClient.fetchQuery({
            queryKey: ['supply', id],
            queryFn: () => getInfo(id),
          }),
          queryClient.fetchQuery({
            queryKey: ['expenditure', id],
            queryFn: () => getExpenditure(id),
          }),
          queryClient.fetchQuery({
            queryKey: ['disposal', id],
            queryFn: () => getDisposal(id),
          }),
          queryClient.fetchQuery({
            queryKey: ['salesPharmacy', id],
            queryFn: () => getSalesP(id),
          }),
        ]);

        setStoreSales(store);
        setProductSupply(supply);
        setExpense(expenseData);
        setDisposal(disposalData);
        setOnlineSales(sales);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error appropriately
      }
    };

    getData();
  }, [id, queryClient]);

  return { expense, productSupply, storeSales, disposal, onlineSales };
};
