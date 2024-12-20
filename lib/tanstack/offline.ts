import { Q } from '@nozbe/watermelondb';
import { useQuery } from '@tanstack/react-query';

import {
  disposedProducts,
  expenseAccounts,
  expenses as expensesDb,
  onlineSales,
  products as productsDb,
  storeSales,
  supplyProduct,
  updateProducts,
} from '~/db';
import { useProductUpdateQty } from '~/lib/zustand/updateProductQty';
import { useProductUpdatePrice } from '~/lib/zustand/useProductUpdatePrice';
// import { useUploadOffline } from '~/hooks/useUploadOffline';

export const useStoreQty = (isConnected: boolean, reload: boolean) => {
  const storeOfflineQty = useProductUpdateQty((state) => state.offlineProducts.length);
  return useQuery({
    queryKey: ['offline_qty', isConnected, reload, reload],
    queryFn: () => {
      return storeOfflineQty;
    },
  });
};
export const useUpdatePrice = (isConnected: boolean, reload: boolean) => {
  const storeOfflineLength = useProductUpdatePrice((state) => state.offlineProducts.length);
  return useQuery({
    queryKey: ['offline_quantity', isConnected, reload, reload],
    queryFn: () => {
      return storeOfflineLength;
    },
    staleTime: 0,
  });
};
export const useStoreOffline = (isConnected: boolean, reload: boolean) => {
  return useQuery({
    queryKey: ['offline_store_offline', isConnected, reload],
    queryFn: async () => {
      return await storeSales.query(Q.where('is_uploaded', Q.eq(false))).fetchCount();
    },
    staleTime: 0,
  });
};
export const useOnlineOffline = (isConnected: boolean, reload: boolean) => {
  return useQuery({
    queryKey: ['offline_store', isConnected, reload],
    queryFn: async () => {
      return await onlineSales.query(Q.where('is_uploaded', Q.eq(false))).fetchCount();
    },

    staleTime: 0,
  });
};
export const useExpenseAccountOffline = (isConnected: boolean, reload: boolean) => {
  return useQuery({
    queryKey: ['offline_account', isConnected, reload],
    queryFn: async () => {
      return await expenseAccounts.query(Q.where('is_uploaded', Q.eq(false))).fetchCount();
    },
    staleTime: 0,
  });
};
export const useExpenseOffline = (isConnected: boolean, reload: boolean) => {
  return useQuery({
    queryKey: ['offline_expense', isConnected, reload],
    queryFn: async () => {
      return await expensesDb.query(Q.where('is_uploaded', Q.eq(false))).fetchCount();
    },
    staleTime: 0,
  });
};
export const useProductOffline = (isConnected: boolean, reload: boolean) => {
  return useQuery({
    queryKey: ['offline_product', isConnected, reload],
    queryFn: async () => {
      return await productsDb.query(Q.where('is_uploaded', Q.eq(false))).fetchCount();
    },
    staleTime: 0,
  });
};
export const useSupplyOffline = (isConnected: boolean, reload: boolean) => {
  return useQuery({
    queryKey: ['offline_supply', isConnected, reload],
    queryFn: async () => {
      return await supplyProduct.query(Q.where('is_uploaded', Q.eq(false))).fetchCount();
    },
    staleTime: 0,
  });
};
export const useDisposeOffline = (isConnected: boolean, reload: boolean) => {
  return useQuery({
    queryKey: ['offline_dispose', isConnected, reload],
    queryFn: async () => {
      return await disposedProducts.query(Q.where('is_uploaded', Q.eq(false))).fetchCount();
    },
    staleTime: 0,
  });
};
export const useUpdateOnlineStatus = (isConnected: boolean, reload: boolean) => {
  return useQuery({
    queryKey: ['offline_online_status', isConnected, reload],
    queryFn: async () => {
      return await updateProducts.query().fetchCount();
    },
    staleTime: 0,
  });
};
