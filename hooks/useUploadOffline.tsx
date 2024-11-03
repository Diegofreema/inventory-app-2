/* eslint-disable prettier/prettier */

import { Q } from '@nozbe/watermelondb';
import axios from 'axios';
import { useCallback, useEffect } from 'react';

import { useNetwork } from './useNetwork';

import database, {
  disposedProducts,
  supplyProduct,
  products as productsDb,
  expenseAccounts,
  expenses as expensesDb,
  storeSales,
  onlineSales,
  updateProducts,
} from '~/db';
import {
  addAccountName,
  addExpenses,
  addOfflineSales,
  addOnlineSales,
  addProduct,
  supplyProducts as supplyProductsOffline,
  sendDisposedProducts,
  uploadPrice,
  uploadQty,
} from '~/lib/helper';
import { useInfo } from '~/lib/tanstack/queries';
import { useProductUpdateQty } from '~/lib/zustand/updateProductQty';
import { useProductUpdatePrice } from '~/lib/zustand/useProductUpdatePrice';
import { useStore } from '~/lib/zustand/useStore';
import Toast from 'react-native-toast-message';

/* eslint-disable prettier/prettier */
export const useUploadOffline = () => {
  const isConnected = useNetwork();

  const storeOfflinePrice = useProductUpdatePrice((state) => state.offlineProducts);
  const deleteOfflinePrice = useProductUpdatePrice((state) => state.removeProduct);
  const storeOfflineQty = useProductUpdateQty((state) => state.offlineProducts);
  const deleteOfflineQty = useProductUpdateQty((state) => state.removeProduct);

  const id = useStore((state) => state.id);
  const { data } = useInfo();
  const upload = useCallback(async () => {
    const [supply, dispose, products, accounts, expenses, store, online] =
      await Promise.all([
        supplyProduct.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
        disposedProducts.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
        productsDb.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
        expenseAccounts.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
        expensesDb.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
        storeSales.query(Q.where('is_uploaded', Q.eq(false))).fetch(),
        onlineSales.query(Q.where('is_uploaded', Q.eq(false))).fetch(),

      ]);
    if (!id || !data) return;

    if (supply.length) {
      supply.forEach(async (item) => {
        await supplyProductsOffline({
          productId: item.productId,
          qty: item.qty,
          dealerShare: info?.shareSeller!,
          netProShare: info?.shareNetpro!,
          unitCost: item.unitCost?.toString(),
          newPrice: item?.unitCost?.toString()!,
          sellingPrice: item.unitCost?.toString()!,
          id,
        }).then(async () => {
          await database.write(async () => {
            supply.forEach(async (item) => {
              await database.batch(item.prepareUpdate((item) => (item.isUploaded = true)));
            });
          });
        });
      });
    }
    if (dispose.length) {
      dispose.forEach(async (item) => {
        sendDisposedProducts({
          productId: item.productId,
          qty: item.qty,
        }).then(async () => {
          await database.write(async () => {
            dispose.forEach(async (item) => {
              await database.batch(item.prepareUpdate((item) => (item.isUploaded = true)));
            });
          });
        });
      });
    }
    if (products.length) {
      products.forEach(async (item) => {
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
          await database.write(async () => {
            products.forEach(async (item) => {
              await database.batch(
                item.prepareUpdate((item) => {
                  item.isUploaded = true;
                  item.productId = data?.result;
                })
              );
            });
          });
        });
      });
    }

    if (accounts.length) {
      accounts.forEach(async (item) => {
        addAccountName({ storeId: id!, account: item.accountName }).then(async () => {
          await database.write(async () => {
            accounts.forEach(async (item) => {
              await database.batch(item.prepareUpdate((item) => (item.isUploaded = true)));
            });
          });
        });
      });
    }
    if (expenses.length) {
      expenses.forEach(async (item) => {
        addExpenses({
          storeId: id!,
          name: item.accountName,
          amount: item.amount.toString(),
          description: item.description!,
        }).then(async () => {
          await database.write(async () => {
            expenses.forEach(async (item) => {
              await database.batch(item.prepareUpdate((item) => (item.isUploaded = true)));
            });
          });
        });
      });
    }

    if (online.length) {
      online.forEach(async ({ id: d, ...item }) => {
        addOnlineSales({
          ...item,
          storeId: id!,
        }).then(async () => {
          await database.write(async () => {
            online.forEach(async (o) => {
              await database.batch(o.prepareUpdate((item) => (item.isUploaded = true)));
            });
          });
        });
      });
    }

    if (store.length) {
      store.forEach(async ({ id: d, ...item }) => {
        addOfflineSales({
          ...item,
          storeId: id!,
          transactionInfo: item.transferInfo!,
          salesRepId: +item.userId,
        }).then(async () => {
          await database.write(async () => {
            store.forEach(async (s) => {
              await database.batch(s.prepareUpdate((item) => (item.isUploaded = true)));
            });
          });
        });
      });
    }
    uploadPrice(storeOfflinePrice, deleteOfflinePrice);
    uploadQty(storeOfflineQty, deleteOfflineQty);
  }, [
    isConnected,
    id,
    data,
    storeOfflinePrice,
    deleteOfflinePrice,
    storeOfflineQty,
    deleteOfflineQty,
    uploadPrice,
    uploadQty,
  ]);
  const info = data?.[0];
  useEffect(() => {
    upload();
  }, [upload]);
};
