/* eslint-disable prettier/prettier */
import axios from 'axios';
import { format } from 'date-fns';
import { z } from 'zod';

import { newProductSchema } from './validators';

import { SalesS } from '~/db/schema';
import { SupplyInsert } from '~/type';

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
    dealerShare: sale.dealershare,
    netProShare: sale.netproshare,
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
    amount: sale.amount,
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

  const formattedData = data?.map((sale) => ({
    productId: sale.productid as string,
    qty: +sale.qty,
    dateX: sale.datex as string,
    unitPrice: +sale.unitprice,
    paid: sale.paid === 'True',
    paymentType: sale.paymenttype as string,
    salesReference: sale.salesreference as string,
    transferInfo: sale.transferinfo as string,
    cid: sale.cid as string,
  }));

  return formattedData;
};

type PaymentType = 'Cash' | 'Card' | 'Transfer';
type DataItem = { paymenttype: PaymentType; unitprice: string | number };

export const calculateTotalsByPaymentType = (data: SalesS[]) => {
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
  await axios.get(
    `https://247api.netpro.software/api.aspx?api=make247sale&cidx=${storeId}&qty=${qty}&productid=${productId}`
  );
};
