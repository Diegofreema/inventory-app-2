/* eslint-disable prettier/prettier */

import { Q } from '@nozbe/watermelondb';

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
import {
  useDisposeOffline,
  useExpenseAccountOffline,
  useExpenseOffline,
  useOnlineOffline,
  useProductOffline,
  useStoreOffline,
  useStoreQty,
  useSupplyOffline,
  useUpdateOnlineStatus,
  useUpdatePrice,
} from '~/lib/tanstack/offline';
import { useInfo } from '~/lib/tanstack/queries';
import { useProductUpdateQty } from '~/lib/zustand/updateProductQty';
import { useProductUpdatePrice } from '~/lib/zustand/useProductUpdatePrice';
import { useStore } from '~/lib/zustand/useStore';

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
    if (products.length) {
      for (const item of products) {
        try {
          const [supplyProducts, disposed, sales] = await Promise.all([
            supplyProduct.query(Q.where('product_id', Q.eq(item.productId))).fetch(),
            disposedProducts.query(Q.where('product_id', Q.eq(item.productId))).fetch(),
            storeSales.query(Q.where('product_id', Q.eq(item.productId))).fetch(),
          ]);

          const productData = {
            product: item.product,
            category: item.category || '',
            state: info?.stateName || '',
            id,
            des: item.description,
            marketprice: String(item.marketPrice || 0),
            online: !!item.online,
            qty: String(item.qty),
            sellingprice: String(item.sellingPrice || 0),
            sharedealer: info?.shareSeller,
            sharenetpro: info?.shareNetpro,
            subcategory: item.subcategory || '',
            customerproductid: item.customerProductId || '',
          };

          const uploadResult = await addProduct(productData);

          if (!uploadResult?.result) {
            throw new Error(`Failed to upload product: ${item.product}`);
          }

          await database.write(async () => {
            const batch = [
              item.prepareUpdate((product) => {
                product.isUploaded = true;
                product.productId = uploadResult.result;
              }),
              ...supplyProducts.map((supplyProduct) =>
                supplyProduct.prepareUpdate((s) => {
                  s.productId = uploadResult.result;
                })
              ),
              ...disposed.map((des) =>
                des.prepareUpdate((d) => {
                  d.productId = uploadResult.result;
                })
              ),
              ...sales.map((s) =>
                s.prepareUpdate((sale) => {
                  sale.productId = uploadResult.result;
                })
              ),
            ];

            await database.batch(batch);
          });
        } catch (error) {
          console.error(`Error uploading product ${item.product}:`, error);
        }
      }
    }

    if (accounts.length) {
      try {
        for (const item of accounts) {
          await addAccountName({
            storeId: id!,
            account: item.accountName,
          });
          await database.write(async () => {
            await database.batch(item.prepareUpdate((i) => (i.isUploaded = true)));
          });
        }
      } catch (e) {
        console.log('Failed to upload account', e);
      }
    }

    if (expenses.length) {
      for (const item of expenses) {
        await addExpenses({
          storeId: id!,
          name: item.accountName,
          amount: item.amount.toString(),
          description: item.description!,
        });
        await database.write(async () => {
          await database.batch(item.prepareUpdate((i) => (i.isUploaded = true)));
        });
      }

    }

    if (online.length) {
      try {
        for (const item of online) {
          await addOnlineSales({
            ...item,
            storeId: id!,
          });
          await database.write(async () => {
            await database.batch(item.prepareUpdate((i) => (i.isUploaded = true)));
          });
        }

      } catch (e) {
        console.log(e, 'Error uploading online');
      }
    }
    if (supply.length) {
      try {
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
        });
        await database.write(async () => {
          await database.batch(item.prepareUpdate((i) => (i.isUploaded = true)));
        });
      }

      } catch (e) {
        console.error(e);
      }
    }
    if (dispose.length) {
      try {
        for (const item of dispose){
          await sendDisposedProducts({
            productId: item.productId,
            qty: item.qty,
          });
          await database.write(async () => {
            await database.batch(item.prepareUpdate((i) => (i.isUploaded = true)));
          });
        }

      } catch (e) {
        console.log(e, 'failed to upload disposed items');
      }
    }
    if (store.length) {
      try {
        for (const item of store) {
          await addOfflineSales({
            qty: item.qty,
            productId: item.productId,
            paymentType: item.paymentType,
            salesReference: item.salesReference,
            storeId: id!,
            transactionInfo: item.transferInfo!,
            salesRepId: +item.userId,
          });

          await database.write(async () => {
            await database.batch(item.prepareUpdate((item) => (item.isUploaded = true)));
          });
        }
      } catch (e) {
        console.log(e, 'Error uploading offline sales');
      }
    }
    uploadPrice(storeOfflinePrice, deleteOfflinePrice);
    uploadQty(storeOfflineQty, deleteOfflineQty);
  };
};

export const useOfflineNumber = () => {
  const isConnected = useNetwork();
  const { reload } = useReCompute();
  const { data, isPending, isError: isErrorQty } = useStoreQty(isConnected, reload);
  const {
    data: dataPrice,
    isPending: isPendingQuantity,
    isError: isErrorQuantity,
  } = useUpdatePrice(isConnected, reload);
  const { data: store, isPending: isPendingStore, isError } = useStoreOffline(isConnected, reload);
  const {
    data: online,
    isPending: isPendingOnline,
    isError: isErr,
  } = useOnlineOffline(isConnected, reload);
  const {
    data: expenseAccount,
    isPending: isPendingAccount,
    isError: isErrorAccount,
  } = useExpenseAccountOffline(isConnected, reload);
  const {
    data: expense,
    isPending: isPendingExpense,
    isError: isE,
  } = useExpenseOffline(isConnected, reload);
  const {
    data: onlineStatus,
    isPending: isPendingStatus,
    isError: isErrorStatus,
  } = useUpdateOnlineStatus(isConnected, reload);
  const {
    data: products,
    isPending: isPendingProducts,
    isError: isErrorProducts,
  } = useProductOffline(isConnected, reload);
  const {
    data: supply,
    isPending: isPendingSupply,
    isError: isErrorSupply,
  } = useSupplyOffline(isConnected, reload);
  const {
    data: disposed,
    isPending: isPendingDisposed,
    isError: isErrorDisposed,
  } = useDisposeOffline(isConnected, reload);
  if (
    isError ||
    isErr ||
    isErrorAccount ||
    isE ||
    isErrorDisposed ||
    isErrorProducts ||
    isErrorSupply ||
    isErrorQty ||
    isErrorQuantity ||
    isErrorStatus
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
    isPendingStore ||
    isPendingQuantity ||
    isPending ||
    isPendingStatus
  ) {
    return 0;
  }
  const total = [
    data,
    dataPrice,
    store,
    online,
    expense,
    expenseAccount,
    products,
    supply,
    disposed,
    onlineStatus,
  ];

  return totalAmount(total);
};
