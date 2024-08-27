import { ProductSelect } from './db/schema';

/* eslint-disable prettier/prettier */
export type PreviewType = {
  title?: string;
  amount?: string | number;
};
// [product],
//   [id],
//   [customerproductid],
//   [groupname] as Category,
//   [category] as Subcategory,
//   [sellingprice],
//   [sharedealer],
//   [sharenetpro],
//   [marketprice],
//   [qty],
//   [online];

export type ProductType = {
  product: string;
  id: string;
  customerproductid: string;
  subcategory: string;
  category: string;
  sellingprice: string;
  sharedealer: string;
  sharenetpro: string;
  marketprice: string;
  qty: string;
  online: number;
};

// [productid], datex, [unitprice], [qty], [id], [dealershare], [netproshare];
export type SalesP = {
  productid: string;
  datex: string;
  unitprice: string;
  qty: string;
  id: string;
  dealershare: string;
  netproshare: string;
};

export type CombinedStore = {
  productid: string;
  datex: string;
  unitprice: string;
  qty: string;
  id?: any;
  salesreference?: string;
  paid?: string;
  cid: any;
  paymenttype?: string;
  transinfo?: string;
  userid?: number;
  dealershare?: string;
  netproshare?: string;
  product?: ProductSelect;
};
export type SalesS = {
  productid: string;
  datex: string;
  unitprice: string;
  qty: string;
  salesreference: string;
  paid: string;
  cid: string;
  paymenttype: string;
  transinfo: string;
  userid: string;
};

export type ExpType = {
  accountname: string;
  datex: string;
  descript?: string;
  amount: string;
};

export type ChartType = {
  amount: number;
  name: string;
};
export type CatType = {
  subcategory: string;
  category: string;
};

export type InfoType = {
  statename: string;
  businessname: string;
  shareseller: string;
  sharenetpro: string;
  shareprice: string;
};

export type SupplyType = {
  datex: string;
  productid: string;
  qty: string;
  unitcost: string;
};
export type NotType = {
  productid: string;
  datex: string;
  unitprice: string;
  qty: string;
  id: string;
  salesreference: string;
  dealershare: string;
  netproshare: string;
};

export type SalesStore = {
  productId: string;
  qty: string;
  salesReference: string;
  transactionInfo: string;
  paymentType: 'Cash' | 'Card' | 'Transfer';
  salesRepId: string;
};
export type SupplyInsert = {
  productId: string;
  qty: string;
  newPrice: string;
  sellingPrice: string;
  dealerShare: string;
  netProShare: string;
  unitCost?: string;
};

export type Cats = {
  category: string;
  subcategories: string[];
};

export type Expense = { accountname: string; amount: number | string };

export type GroupedExpense = {
  [key: string]: { name: string; amount: number };
};
