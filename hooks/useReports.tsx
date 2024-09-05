/* eslint-disable prettier/prettier */

import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { disposedProducts, expenses, onlineSales, storeSales, supplyProduct } from '~/db';
import DisposedProducts from '~/db/model/DisposedProducts';
import Expenses from '~/db/model/Expenses';
import OnlineSale from '~/db/model/OnlineSale';
import StoreSales from '~/db/model/StoreSale';
import SupplyProduct from '~/db/model/SupplyProduct';
import { useStore } from '~/lib/zustand/useStore';

export const useReports = () => {
  const id = useStore((state) => state.id);
  const [storeSale, setStoreSales] = useState<StoreSales[]>([]);
  const [onlineSale, setOnlineSales] = useState<OnlineSale[]>([]);
  const [productSupply, setProductSupply] = useState<SupplyProduct[]>([]);
  const [expense, setExpense] = useState<Expenses[]>([]);
  const [disposal, setDisposal] = useState<DisposedProducts[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const getData = async () => {
      if (!id) return;
      try {
        const [store, supply, expenseData, disposalData, sales] = await Promise.all([
          queryClient.fetchQuery({
            queryKey: ['salesStore'],
            queryFn: async () => {
              const data = await storeSales.query().fetch();
              return data;
            },
            structuralSharing: false,
          }),
          queryClient.fetchQuery({
            queryKey: ['supply'],
            queryFn: async () => {
              const data = await supplyProduct.query().fetch();
              return data;
            },
            structuralSharing: false,
          }),
          queryClient.fetchQuery({
            queryKey: ['expenditure'],
            queryFn: async () => {
              const data = await expenses.query().fetch();
              return data;
            },
            structuralSharing: false,
          }),
          queryClient.fetchQuery({
            queryKey: ['disposal'],
            queryFn: async () => {
              const data = await disposedProducts.query().fetch();
              return data;
            },
            structuralSharing: false,
          }),
          queryClient.fetchQuery({
            queryKey: ['salesPharmacy'],
            queryFn: async () => {
              const data = await onlineSales.query().fetch();
              return data;
            },
            structuralSharing: false,
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

  return { expense, productSupply, storeSale, disposal, onlineSale };
};
