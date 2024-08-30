/* eslint-disable prettier/prettier */

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useDrizzle } from './useDrizzle';

import { DisposedSelect, ExpenseSelect, SalesP, SalesS, supplyProductSelect } from '~/db/schema';
import { useStore } from '~/lib/zustand/useStore';

export const useReports = () => {
  const id = useStore((state) => state.id);
  const [storeSales, setStoreSales] = useState<SalesS[]>([]);
  const [onlineSales, setOnlineSales] = useState<SalesP[]>([]);
  const [productSupply, setProductSupply] = useState<supplyProductSelect[]>([]);
  const [expense, setExpense] = useState<ExpenseSelect[]>([]);
  const [disposal, setDisposal] = useState<DisposedSelect[]>([]);
  const queryClient = useQueryClient();
  const { db } = useDrizzle();

  useEffect(() => {
    const getData = async () => {
      if (!id) return;
      try {
        const [store, supply, expenseData, disposalData, sales] = await Promise.all([
          queryClient.fetchQuery({
            queryKey: ['salesStore'],
            queryFn: async () => {
              const data = await db.query.storeSales.findMany({
                with: {
                  product: true,
                },
              });
              return data;
            },
          }),
          queryClient.fetchQuery({
            queryKey: ['supply'],
            queryFn: async () => {
              const data = await db.query.supplyProduct.findMany();
              return data;
            },
          }),
          queryClient.fetchQuery({
            queryKey: ['expenditure'],
            queryFn: async () => {
              const data = await db.query.expenses.findMany();
              return data;
            },
          }),
          queryClient.fetchQuery({
            queryKey: ['disposal'],
            queryFn: async () => {
              const data = await db.query.disposedProducts.findMany();
              return data;
            },
          }),
          queryClient.fetchQuery({
            queryKey: ['salesPharmacy'],
            queryFn: async () => {
              const data = await db.query.onlineSale.findMany({
                with: {
                  product: true,
                },
              });
              return data;
            },
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
