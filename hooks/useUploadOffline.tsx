/* eslint-disable prettier/prettier */

import { Q } from '@nozbe/watermelondb';
import { useCallback, useEffect, useState } from 'react';

import { useNetwork } from './useNetwork';

import database, {
  disposedProducts,
  expenseAccounts,
  expenses as expensesDb,
  onlineSales,
  products as productsDb,
  storeSales,
  supplyProduct,
} from '~/db';
import { useReCompute } from '~/hooks/useRecomputate';
import {
  addAccountName,
  addExpenses,
  addOfflineSales,
  addOnlineSales,
  addProduct,
  sendDisposedProducts,
  supplyProducts as supplyProductsOffline,
  totalAmount,
  uploadPrice,
  uploadQty,
} from '~/lib/helper';
import { useInfo } from '~/lib/tanstack/queries';
import { useProductUpdateQty } from '~/lib/zustand/updateProductQty';
import { useProductUpdatePrice } from '~/lib/zustand/useProductUpdatePrice';
import { useStore } from '~/lib/zustand/useStore';
import {
  useDisposeOffline,
  useExpenseAccountOffline,
  useExpenseOffline,
  useOnlineOffline,
  useProductOffline,
  useStoreOffline,
  useStoreQty,
  useStoreQuantity,
  useSupplyOffline,
} from '~/lib/tanstack/offline';

/* eslint-disable prettier/prettier */
export const useUploadOffline = () => {
  const storeOfflinePrice = useProductUpdatePrice((state) => state.offlineProducts);
  const deleteOfflinePrice = useProductUpdatePrice((state) => state.removeProduct);
  const storeOfflineQty = useProductUpdateQty((state) => state.offlineProducts);
  const deleteOfflineQty = useProductUpdateQty((state) => state.removeProduct);

  const id = useStore((state) => state.id);
  const { data } = useInfo();
  const info = data?.[0];

  return async () => {
    const [supply, dispose, products, accounts, expenses, store, online] = await Promise.all([
      supplyProduct.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
      disposedProducts.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
      productsDb.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
      expenseAccounts.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
      expensesDb.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
      storeSales.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
      onlineSales.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
    ]);
    if (!id || !data) return;
    console.log(supply.length, 'Supply data');
    if (supply.length) {
      for (const item of supply) {
        await supplyProductsOffline({
          productId: item.productId,
          qty: item.qty,
          dealerShare: info?.shareSeller!,
          netProShare: info?.shareNetpro!,
          unitCost: item.unitCost?.toString(),
          newPrice: item?.newPrice?.toString()!,
          sellingPrice: item.unitCost?.toString()!,
          id,
        }).then(async () => {
          await database
            .write(async () => {
              for (const item1 of supply) {
                await database.batch(item1.prepareUpdate((item) => (item.isUploaded = true)));
              }
            })
            .catch((e) => console.log(e, 'Supply error'));
        });
      }
    }
    console.log(dispose.length, 'disposed');
    if (dispose.length) {
      for (const item of dispose) {
        sendDisposedProducts({
          productId: item.productId,
          qty: item.qty,
        }).then(async () => {
          await database
            .write(async () => {
              for (const item1 of dispose) {
                await database.batch(item1.prepareUpdate((item) => (item.isUploaded = true)));
              }
            })
            .catch((e) => console.log(e, 'disposed error'));
        });
      }
    }
    console.log(products.length, 'products');
    if (products.length) {
      for (const item of products) {
        addProduct({
          product: item.product,
          category: item.category!,
          state: info?.stateName!,
          id,
          des: '',
          marketprice: item.marketPrice?.toString()!,
          online: !!item.online,
          qty: item.qty.toString(),
          sellingprice: item.sellingPrice?.toString()!,
          sharedealer: info?.shareSeller,
          sharenetpro: info?.shareNetpro,
          subcategory: item.subcategory!,
          customerproductid: item.customerProductId!,
        }).then(async (data) => {
          await database
            .write(async () => {
              for (const item1 of products) {
                await database.batch(
                  item1.prepareUpdate((item) => {
                    item.isUploaded = true;
                    item.productId = data?.result;
                  })
                );
              }
            })
            .catch((e) => console.log(e, 'products error'));
        });
      }
    }
    console.log(accounts.length, 'Account');
    if (accounts.length) {
      for (const item of accounts) {
        addAccountName({
          storeId: id!,
          account: item.accountName,
        }).then(async () => {
          await database
            .write(async () => {
              for (const item1 of accounts) {
                await database.batch(item1.prepareUpdate((item) => (item.isUploaded = true)));
              }
            })
            .catch((e) => console.log(e, 'account error'));
        });
      }
    }
    console.log(expenses.length, 'Expense');
    if (expenses.length) {
      for (const item of expenses) {
        addExpenses({
          storeId: id!,
          name: item.accountName,
          amount: item.amount.toString(),
          description: item.description!,
        }).then(async () => {
          await database
            .write(async () => {
              for (const item1 of expenses) {
                await database.batch(item1.prepareUpdate((item) => (item.isUploaded = true)));
              }
            })
            .catch((e) => console.log(e, 'Expenses error'));
        });
      }
    }
    console.log(online.length, 'Online');
    if (online.length) {
      for (const { id: d, ...item } of online) {
        addOnlineSales({
          ...item,
          storeId: id!,
        }).then(async () => {
          await database
            .write(async () => {
              for (const o of online) {
                await database.batch(o.prepareUpdate((item) => (item.isUploaded = true)));
              }
            })
            .catch((e) => console.log(e, 'Online error'));
        });
      }
    }
    console.log(store.length, 'Store ');
    if (store.length) {
      for (const { id: d, ...item } of store) {
        addOfflineSales({
          ...item,
          storeId: id!,
          transactionInfo: item.transferInfo!,
          salesRepId: +item.userId,
        }).then(async () => {
          await database
            .write(async () => {
              for (const s of store) {
                await database.batch(s.prepareUpdate((item) => (item.isUploaded = true)));
              }
            })
            .catch((e) => console.log(e, 'store error'));
        });
      }
    }
    uploadPrice(storeOfflinePrice, deleteOfflinePrice);
    uploadQty(storeOfflineQty, deleteOfflineQty);
  };
};

export const useOfflineNumber = () => {
  const isConnected = useNetwork();
  const {reload} = useReCompute()
  const { data, isPending, isError: isErrorQty } = useStoreQty(isConnected, reload);
  const {
    data: dataQuantity,
    isPending: isPendingQuantity,
    isError: isErrorQuantity,
  } = useStoreQuantity(isConnected,reload);
  const { data: store, isPending: isPendingStore, isError } = useStoreOffline(isConnected, reload);
  const {
    data: online,
    isPending: isPendingOnline,
    isError: isErr,
  } = useOnlineOffline(isConnected,reload);
  const {
    data: expenseAccount,
    isPending: isPendingAccount,
    isError: isErrorAccount,
  } = useExpenseAccountOffline(isConnected,reload);
  const {
    data: expense,
    isPending: isPendingExpense,
    isError: isE,
  } = useExpenseOffline(isConnected,reload);
  const {
    data: products,
    isPending: isPendingProducts,
    isError: isErrorProducts,
  } = useProductOffline(isConnected,reload);
  const {
    data: supply,
    isPending: isPendingSupply,
    isError: isErrorSupply,
  } = useSupplyOffline(isConnected,reload);
  const {
    data: disposed,
    isPending: isPendingDisposed,
    isError: isErrorDisposed,
  } = useDisposeOffline(isConnected,reload);
  if (
    isError ||
    isErr ||
    isErrorAccount ||
    isE ||
    isErrorDisposed ||
    isErrorProducts ||
    isErrorSupply || isErrorQty || isErrorQuantity
  ) {
    return 0;
  }
  if (
    isPendingDisposed ||
    isPendingAccount ||
    isPendingSupply ||
    isPendingProducts ||
    isPendingExpense ||
    isPendingOnline ||
    isPendingStore || isPendingQuantity || isPending
  ) {
    return 0;
  }
  const total = [
    data,
    dataQuantity,
    store,
    online,
    expense,
    expenseAccount,
    products,
    supply,
    disposed,
  ];

  console.log({data,
    dataQuantity,
    store,
    online,
    expense,
    expenseAccount,
    products,
    supply,
    disposed,});
  return totalAmount(total);
};
