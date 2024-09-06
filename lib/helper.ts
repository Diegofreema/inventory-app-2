/* eslint-disable prettier/prettier */
import { Q } from '@nozbe/watermelondb';
import axios from 'axios';
import { format } from 'date-fns';
import { z } from 'zod';

import { newProductSchema } from './validators';

import database, {
  categories,
  disposedProducts,
  expenseAccounts,
  expenses,
  onlineSales,
  products,
  storeSales,
  supplyProduct,
} from '~/db';
import StoreSales from '~/db/model/StoreSale';
import {
  DisposalFromDb,
  ExpensesFromDb,
  OnlineSaleFromDb,
  ProductFromDb,
  StoreSalesFromDb,
  SupplyInsert,
} from '~/type';

export const api = process.env.EXPO_PUBLIC_API;

export const calculateTotalSales = (sales: number[] | undefined): number =>
  sales?.reduce((total, padding) => total + padding || 0, 0) ?? 0;

export const colors = [
  '#F08080', // Light Coral
  '#FFD700', // Gold
  '#7FFFD4', // Aquamarine
  '#87CEEB', // Sky Blue
  '#9370DB', // Medium Purple
  '#FF69B4', // Hot Pink
  '#20B2AA', // Light Sea Green
  '#FFA07A', // Light Salmon
  '#00CED1', // Dark Turquoise
  '#FF6347', // Tomato
  '#4682B4', // Steel Blue
  '#32CD32', // Lime Green
  '#FF4500', // Orange Red
  '#8A2BE2', // Blue Violet
  '#7B68EE', // Medium Slate Blue
  '#00FA9A', // Medium Spring Green
  '#48D1CC', // Medium Turquoise
  '#FF1493', // Deep Pink
  '#1E90FF', // Dodger Blue
  '#ADFF2F', // Green Yellow
  '#DC143C', // Crimson
  '#00BFFF', // Deep Sky Blue
  '#FF8C00', // Dark Orange
  '#9932CC', // Dark Orchid
  '#8FBC8F', // Dark Sea Green
  '#BA55D3', // Medium Orchid
  '#F0E68C', // Khaki
  '#DDA0DD', // Plum
  '#98FB98', // Pale Green
  '#40E0D0', // Turquoise
  '#FAF0E6', // Linen
  '#B0C4DE', // Light Steel Blue
  '#FFA500', // Orange
  '#DAA520', // Goldenrod
  '#66CDAA', // Medium Aquamarine
  '#FF00FF', // Magenta
  '#6A5ACD', // Slate Blue
  '#483D8B', // Dark Slate Blue
  '#7CFC00', // Lawn Green
  '#F4A460', // Sandy Brown
];

export const getProducts = async (id: string) => {
  const response = await axios.get(
    `https://247api.netpro.software/api.aspx?api=getproducts&cidx=${id}`
  );
  let data = [];
  if (Object.prototype.toString.call(response.data) === '[object Object]') {
    data.push(response.data);
  } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
    data = [...response.data];
  }
  console.log(data);

  const formattedProducts = data.map((product) => ({
    category: product.Category,
    subcategory: product.Subcategory,
    productId: product.id,
    product: product.product,
    customerProductId: product.customerproductid,
    marketPrice: +product.marketprice,
    online: product.online === 'True',
    qty: +product.qty,
    sellingPrice: +product.sellingprice,
    shareDealer: +product.sharedealer,
    shareNetpro: +product.sharenetpro,
    description: product.des,
  }));
  return formattedProducts;
};

export const trimText = (text: string, limit = 10): string => {
  if (text.length > limit) return text.substring(0, limit) + '...';
  return text;
};

export const formattedDate = (date: string) => {
  return format(date, 'dd/MM/yyyy');
};

export const getSalesP = async (id: string) => {
  const response = await axios.get(
    `https://247api.netpro.software/api.aspx?api=get247sales&cidx=${id}`
  );
  let data = [];
  if (Object.prototype.toString.call(response.data) === '[object Object]') {
    data.push(response.data);
  } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
    data = [...response.data];
  }
  const formattedData = data?.map((sale) => ({
    id: +sale.id,
    productId: sale.productid,
    qty: +sale.qty,
    unitPrice: +sale.unitprice,
    dateX: sale.datex,
    dealerShare: +sale.dealershare,
    netProShare: +sale.netproshare,
  }));
  return formattedData;
};

export const getExpenditure = async (id: any) => {
  const response = await axios.get(
    `https://247api.netpro.software/api.aspx?api=getexpenses&cidx=${id}`
  );
  let data = [];
  if (Object.prototype.toString.call(response.data) === '[object Object]') {
    data.push(response.data);
  } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
    data = [...response.data];
  }

  const formattedExpenditure = data?.map((sale) => ({
    accountName: sale?.accountname,
    dateX: sale.datex,
    description: sale.descript,
    amount: +sale.amount,
  }));

  return formattedExpenditure;
};

export const getSupply = async (id: any) => {
  const response = await axios.get(
    `https://247api.netpro.software/api.aspx?api=getproductsupply&cidx=${id}`
  );
  let data = [];
  if (Object.prototype.toString.call(response.data) === '[object Object]') {
    data.push(response.data);
  } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
    data = [...response.data];
  }

  const formattedData = data?.map((sale) => ({
    qty: +sale.qty,
    productId: sale.productid,
    unitCost: +sale.unitcost,
    dateX: sale.datex,
  }));
  return formattedData;
};

export const getSale = async (id: any) => {
  const response = await axios.get(
    `https://247api.netpro.software/api.aspx?api=getpharmacysales&cidx=${id}`
  );
  let data = [];
  if (Object.prototype.toString.call(response.data) === '[object Object]') {
    data.push(response.data);
  } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
    data = [...response.data];
  }
  console.log(data, 'getSale');

  const formattedData = data?.map((sale) => ({
    productId: sale.productid as string,
    qty: +sale.qty,
    dateX: sale.datex as string,
    unitPrice: +sale.unitprice,
    paid: sale.paid === 'True',
    paymentType: sale.paymenttype as string,
    salesReference: sale.salesreference as string,
    transferInfo: sale.transinfo as string,
    cid: sale.cid as string,
    userId: sale.userid,
  }));

  return formattedData;
};

type PaymentType = 'Cash' | 'Card' | 'Transfer';
type DataItem = { paymenttype: PaymentType; unitprice: string | number };

export const calculateTotalsByPaymentType = (data: StoreSales[]) => {
  // @ts-ignore
  const dataItem: DataItem[] = data?.map((d) => ({
    paymenttype: d.paymentType,
    unitprice: d?.unitPrice,
  }));
  const totals = dataItem.reduce(
    (acc, item) => {
      const price = Number(item.unitprice);
      if (!isNaN(price)) {
        acc[item.paymenttype] = (acc[item.paymenttype] || 0) + price;
      }
      return acc;
    },
    {} as Record<PaymentType, number>
  );

  return [
    { type: 'Card', value: totals.Card || 0 },
    { type: 'Transfer', value: totals.Transfer || 0 },
    { type: 'Cash', value: totals.Cash || 0 },
  ];
};

export const getDisposal = async (id: any) => {
  const response = await axios.get(
    `https://247api.netpro.software/api.aspx?api=getproductdisposal&cidx=${id}`
  );
  let data = [];
  if (Object.prototype.toString.call(response.data) === '[object Object]') {
    data.push(response.data);
  } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
    data = [...response.data];
  }

  const formattedData = data?.map((sale) => ({
    productId: sale.productid,
    dateX: sale.datex,
    qty: +sale.qty,
    unitCost: +sale.unitcost,
  }));
  return formattedData;
};

export const expensesAccount = async (id: any) => {
  const response = await axios.get(
    `https://247api.netpro.software/api.aspx?api=getexpensact&cidx=${id}`
  );
  let data: { accountname: string }[] = [];
  if (Object.prototype.toString.call(response.data) === '[object Object]') {
    data.push(response.data);
  } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
    data = [...response.data];
  }

  const formattedData = data?.map((sale) => ({
    accountName: sale.accountname,
  }));
  return formattedData;
};

export const totalAmount = (numbers: number[]) => {
  return numbers.reduce((acc, number) => acc + number, 0);
};

export const rearrangeDateString = (date: string) => {
  return date.split('/').reverse().join('-');
};

// export const generateIdIfNotInDb = (products: ProductSelect[]) => {
//   const id = createId()
//   const isInDb = products.
// };

export const getCat = async () => {
  const response = await axios.get(`https://247api.netpro.software/api.aspx?api=productcategory`);
  let data = [];
  if (Object.prototype.toString.call(response.data) === '[object Object]') {
    data.push(response.data);
  } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
    data = [...response.data];
  }

  return data;
};

export const supplyProducts = async ({
  dealerShare,
  netProShare,
  newPrice,
  productId,
  qty,
  sellingPrice,
  unitCost,
  id,
}: SupplyInsert & { id: string }) => {
  const { data } = await axios.get(
    `https://247api.netpro.software/api.aspx?api=addsupply&cidx=${id}&productid=${productId}&qty=${qty}&unitcost=${unitCost}&newprice=${newPrice}&getsellingprice=${sellingPrice}&getdealershare=${dealerShare}&getnetproshare=${netProShare}`
  );
  return data;
};

export const sendDisposedProducts = async ({
  qty,
  productId,
}: {
  qty: number;
  productId: string;
}) => {
  const { data } = await axios.get(
    `https://247api.netpro.software/api.aspx?api=adddisposal&qty=${qty}&productid=${productId}`
  );
  return data;
};

export const addProduct = async ({
  category,
  des,
  marketprice,
  online,
  product,
  qty,
  sellingprice,
  sharedealer,
  sharenetpro,
  state,
  subcategory,
  customerproductid,
  id,
}: z.infer<typeof newProductSchema> & { id: string | undefined }) => {
  const { data } = await axios.get(
    `https://247api.netpro.software/api.aspx?api=addproduct&customerproductid=${customerproductid}&online=${online}&productname=${product}&cidx=${id}&qty=${qty}&statename=${state}&description=${des}&productcategory=${category}&productsubcategory=${subcategory}&marketprice=${marketprice}&getsellingprice=${sellingprice}&getdealershare=${sharedealer}&getnetproshare=${sharenetpro}`
  );

  return data;
};

export const addAccountName = async ({
  storeId,
  account,
}: {
  storeId: string;
  account: string;
}) => {
  const { data } = await axios.get(
    `https://247api.netpro.software/api.aspx?api=addexpenseact&accountname=${account}&cidx=${storeId}`
  );
  return data;
};

export const addExpenses = async ({
  name,
  storeId,
  description,
  amount,
}: {
  name: string;
  storeId: string;
  description?: string;
  amount: string;
}) => {
  const { data } = await axios.get(
    `https://247api.netpro.software/api.aspx?api=addexpenses&accountname=${name}&cidx=${storeId}&description=${description}&amount=${amount}`
  );

  return data;
};

export const addOfflineSales = async ({
  storeId,
  qty,
  productId,
  salesReference,
  paymentType,
  transactionInfo,
  salesRepId,
}: {
  storeId: string;
  qty: number;
  productId: string;
  salesReference: string;
  paymentType: any;
  transactionInfo: string;
  salesRepId: number;
}) => {
  const { data } = await axios.get(
    `https://247api.netpro.software/api.aspx?api=makepharmacysale&cidx=${storeId}&qty=${qty}&productid=${productId}&salesref=${salesReference}&paymenttype=${paymentType}&transactioninfo=${transactionInfo}&salesrepid=${salesRepId}`
  );
  return data;
};

export const addOnlineSales = async ({
  storeId,
  qty,
  productId,
}: {
  storeId: string;
  qty: number;
  productId: string;
}) => {
  const { data } = await axios.get(
    `https://247api.netpro.software/api.aspx?api=make247sale&cidx=${storeId}&qty=${qty}&productid=${productId}`
  );

  return data;
};

// watermelon db interactions

export const createProduct = async (p: ProductFromDb, isUploaded = true) => {
  return await database.write(async () => {
    return await products.create((product) => {
      product.product = p.product;
      product.category = p.category;
      product.subcategory = p.subcategory;
      product.customerProductId = p.customerProductId;
      product.marketPrice = p.marketPrice;
      product.online = p.online;
      product.qty = p.qty;
      product.sellingPrice = +p.sellingPrice;
      product.shareDealer = +p.shareDealer;
      product.shareNetpro = +p.shareNetpro;
      product.isUploaded = isUploaded;
      product.description = p.description;
      product.productId = p.productId;
    });
  });
};
export const createProducts = async (newProduct: ProductFromDb[], isUploaded = true) => {
  newProduct.forEach(async (p) => {
    await database.write(async () => {
      await database.batch(
        products.prepareCreate((product) => {
          product.product = p.product;
          product.category = p.category;
          product.subcategory = p.subcategory;
          product.customerProductId = p.customerProductId;
          product.marketPrice = p.marketPrice;
          product.online = p.online;
          product.qty = p.qty;
          product.sellingPrice = +p.sellingPrice;
          product.shareDealer = +p.shareDealer;
          product.shareNetpro = +p.shareNetpro;
          product.isUploaded = isUploaded;
          product.description = p.description;
          product.productId = p.productId;
        })
      );
    });
  });

  return newProduct;
};

export const createOnlineSales = async (newSales: OnlineSaleFromDb[], isUploaded = true) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  newSales.forEach(async (sale) => {
    const productInDb = await products
      .query(Q.where('product_id', Q.eq(sale.productId)), Q.take(1))
      .fetch();
    await database.write(async () => {
      await database.batch(
        onlineSales.prepareCreate((st) => {
          st.productId = sale.productId;
          st.dateX = sale.dateX;
          st.qty = sale.qty;
          st.unitPrice = sale.unitPrice;
          st.dealerShare = sale.dealerShare;
          st.netProShare = sale.netProShare;
          st.isUploaded = isUploaded;
          st.name = productInDb[0]?.product;
        })
      );
    });
  });
};

export const createStoreSales = async (newSales: StoreSalesFromDb[], isUploaded = true) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  newSales.forEach(async (sale) => {
    const productInDb = await products
      .query(Q.where('product_id', Q.eq(sale.productId)), Q.take(1))
      .fetch();
    await database.write(async () => {
      await database.batch(
        storeSales.prepareCreate((st) => {
          st.productId = sale.productId;
          st.dateX = sale.dateX;
          st.qty = sale.qty;
          st.unitPrice = sale.unitPrice;
          st.isPaid = sale.paid;
          st.paymentType = sale.paymentType;
          st.salesReference = sale.salesReference;
          st.transferInfo = sale.transferInfo;
          st.cid = sale.cid;
          st.isUploaded = isUploaded;
          st.name = productInDb[0]?.product;
        })
      );
    });
  });
};

export const createExpenses = async (newExpense: ExpensesFromDb[], isUploaded = true) => {
  newExpense.forEach(async (exp) => {
    await database.write(async () => {
      await database.batch(
        expenses.prepareCreate((expense) => {
          expense.accountName = exp.accountName;
          expense.dateX = exp.dateX;
          expense.description = exp.description;
          expense.amount = exp.amount;
          expense.isUploaded = isUploaded;
        })
      );
    });
  });
};

export const createDisposals = async (newDisposal: DisposalFromDb[], isUploaded = true) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  newDisposal.forEach(async (dis) => {
    const productInDb = await products
      .query(Q.where('product_id', Q.eq(dis.productId)), Q.take(1))
      .fetch();
    await database.write(async () => {
      await database.batch(
        disposedProducts.prepareCreate((disposal) => {
          disposal.dateX = dis.dateX;
          disposal.productId = dis.productId;
          disposal.qty = dis.qty;
          disposal.unitCost = dis.unitCost;
          disposal.isUploaded = isUploaded;
          disposal.name = productInDb[0]?.product;
        })
      );
    });
  });
};

export const createAccount = async (accounts: { accountName: string }[], isUploaded = true) => {
  accounts.forEach(async (acc) => {
    await database.write(async () => {
      await database.batch(
        expenseAccounts.prepareCreate((account) => {
          account.accountName = acc.accountName;
          account.isUploaded = isUploaded;
        })
      );
    });
  });
};
export const createCats = async (cats: { category: string; subcategory: string }[]) => {
  cats.forEach(async (cat) => {
    await database.write(async () => {
      await database.batch(
        categories.prepareCreate((category) => {
          category.category = cat.category;
          category.subcategory = cat.subcategory;
        })
      );
    });
  });
};

export const createSupply = async (supplies: DisposalFromDb[], isUploaded = true) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  supplies.forEach(async (sup) => {
    const productInDb = await products
      .query(Q.where('product_id', Q.eq(sup.productId)), Q.take(1))
      .fetch();
    await database.write(async () => {
      await database.batch(
        supplyProduct.prepareCreate((supply) => {
          supply.productId = sup.productId;
          supply.qty = sup.qty;
          supply.dateX = sup.dateX;
          supply.unitCost = sup.unitCost;
          supply.isUploaded = isUploaded;
          supply.name = productInDb[0]?.product;
        })
      );
    });
  });
};

export const nameUnnamedSales = async () => {
  const unnamedSales = await onlineSales.query(Q.where('name', Q.eq(''))).fetch();
  const pts = await products.query().fetch();
  unnamedSales.forEach(async (sale) => {
    const product = pts.find((p) => p.productId === sale.productId);
    if (product) {
      await database.write(async () => {
        await sale.update((s) => {
          s.name = product.product;
        });
      });
    }
  });
};

export const nameUnnamedSalesOffline = async () => {
  const unnamedSales = await storeSales.query(Q.where('name', Q.eq(''))).fetch();

  const pts = await products.query().fetch();
  unnamedSales.forEach(async (sale) => {
    const product = pts.find((p) => p.productId === sale.productId);
    if (product) {
      await database.write(async () => {
        await sale.update((s) => {
          s.name = product.product;
        });
      });
    }
  });
};
export const nameUnnamedDisposed = async () => {
  const unnamedSales = await disposedProducts.query(Q.where('name', Q.eq(''))).fetch();

  const pts = await products.query().fetch();
  unnamedSales.forEach(async (sale) => {
    const product = pts.find((p) => p.productId === sale.productId);
    if (product) {
      await database.write(async () => {
        await sale.update((s) => {
          s.name = product.product;
        });
      });
    }
  });
};
export const nameUnnamedSupply = async () => {
  const unnamedSales = await supplyProduct.query(Q.where('name', Q.eq(''))).fetch();

  const pts = await products.query().fetch();
  unnamedSales.forEach(async (sale) => {
    const product = pts.find((p) => p.productId === sale.productId);
    if (product) {
      await database.write(async () => {
        await sale.update((s) => {
          s.name = product.product;
        });
      });
    }
  });
};
