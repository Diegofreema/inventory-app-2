/* eslint-disable prettier/prettier */

import { createId } from '@paralleldrive/cuid2';
import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const product = sqliteTable('products', {
  id: integer('id').notNull().primaryKey(),
  productId: text('product_id').notNull(),
  category: text('category'),
  subcategory: text('subcategory'),
  customerproductid: text('customer_product_id'),
  marketprice: text('market_price'),
  online: text('online', { enum: ['True', 'False'] }),
  product: text('product').notNull(),
  qty: text('qty').notNull(),
  sellingprice: text('seller_price'),
  sharedealer: text('share_dealer'),
  sharenetpro: text('share_netpro'),
});
export const productOffline = sqliteTable('products_offline', {
  id: integer('id').notNull().primaryKey(),
  productId: text('product_id').notNull(),
  category: text('category'),
  subcategory: text('subcategory'),
  customerproductid: text('customer_product_id'),
  marketprice: text('market_price'),
  online: text('online'),
  product: text('product').notNull(),
  qty: text('qty').notNull(),
  sellingprice: text('seller_price'),
  sharedealer: text('share_dealer'),
  sharenetpro: text('share_netpro'),
});

export const staff = sqliteTable('staff', {
  id: integer('id').notNull().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
  pharmacyId: text('pharmacy_id'),
});

export const pharmacySales = sqliteTable('pharmacy_sales', {
  id: integer('id').notNull().primaryKey(),
  productid: text('product_id')
    .notNull()
    .references(() => product.productId),
  qty: text('qty').notNull(),
  unitprice: text('unit_price').notNull(),
  datex: text('date').notNull(),
  dealershare: text('dealer_share').notNull(),
  netproshare: text('netpro_share').notNull(),
});
export const pharmacySalesOffline = sqliteTable('pharmacy_sales_offline', {
  id: integer('id').notNull().primaryKey(),
  productid: text('product_id')
    .notNull()
    .references(() => product.productId),
  qty: text('qty').notNull(),
  unitprice: text('unit_price').notNull(),
  datex: text('date').notNull(),
  dealershare: text('dealer_share').notNull(),
  netproshare: text('netpro_share').notNull(),
});

export const pharmacySalesRelation = relations(pharmacySales, ({ one }) => ({
  product: one(product, {
    fields: [pharmacySales.productid],
    references: [product.productId],
  }),
}));

export const storeSales = sqliteTable('store_sales', {
  id: integer('id').notNull().primaryKey(),
  productid: text('product_id')
    .notNull()
    .references(() => product.productId),
  datex: text('date').notNull(),
  unitprice: text('unit_price').notNull(),
  qty: text('qty').notNull(),
  salesreference: text('sales_reference').notNull(),
  paymenttype: text('payment_type').notNull(),
  transinfo: text('trans_info').notNull(),
  paid: text('paid').notNull(),
  userid: integer('user_id')
    .notNull()
    .references(() => staff.id),
  cid: text('cid'),
});
export const disposedProducts = sqliteTable('disposed_products', {
  id: integer('id').notNull().primaryKey(),
  productid: integer('product_id')
    .notNull()
    .references(() => product.productId),
  qty: text('qty').notNull(),
  datex: text('date').notNull(),
});
export const disposedProductsOffline = sqliteTable('disposed_products_offline', {
  id: integer('id').notNull().primaryKey(),
  productid: integer('product_id')
    .notNull()
    .references(() => product.productId),
  qty: text('qty').notNull(),
  datex: text('date').notNull(),
});

export const storeSalesOffline = sqliteTable('store_sales_offline', {
  id: integer('id').notNull().primaryKey(),
  productid: text('product_id')
    .notNull()
    .references(() => product.productId),
  datex: text('date').notNull(),
  unitprice: text('unit_price').notNull(),
  qty: text('qty').notNull(),
  salesreference: text('sales_reference').notNull(),
  paymenttype: text('payment_type').notNull(),
  transinfo: text('trans_info').notNull(),
  paid: text('paid').notNull(),
  userid: integer('user_id')
    .notNull()
    .references(() => staff.id),
  cid: text('cid'),
});
export const storeSalesRelation = relations(storeSales, ({ one }) => ({
  product: one(product, {
    fields: [storeSales.productid],
    references: [product.productId],
  }),
}));

export const storeStaffRelation = relations(storeSales, ({ one }) => ({
  staff: one(staff),
}));
export const expenseAccount = sqliteTable('expense_account', {
  id: integer('id').notNull().primaryKey(),
  accountname: text('account_name').notNull(),
});
export const expenseAccountOffline = sqliteTable('expense_account_offline', {
  id: integer('id').notNull().primaryKey(),
  accountname: text('account_name').notNull(),
});
export const expenses = sqliteTable('expenses', {
  id: integer('id').notNull().primaryKey(),
  accountname: text('account_name').notNull(),
  datex: text('date').notNull(),
  descript: text('description'),
  amount: text('amount').notNull(),
});
export const expensesOffline = sqliteTable('expenses_offline', {
  id: integer('id').notNull().primaryKey(),
  accountname: text('account_name').notNull(),
  datex: text('date').notNull(),
  descript: text('description'),
  amount: text('amount').notNull(),
});

export const category = sqliteTable('categories', {
  id: integer('id').notNull().primaryKey(),
  category: text('category').notNull(),
  subcategory: text('subcategory').notNull(),
});
export const categoryOffline = sqliteTable('categories_offline', {
  id: integer('id').notNull().primaryKey(),
  category: text('category').notNull(),
  subcategory: text('subcategory').notNull(),
});

export const pharmacyInfo = sqliteTable('pharmacy_info', {
  id: integer('id').notNull().primaryKey(),
  statename: text('state_name').notNull(),
  businessname: text('business_name').notNull(),
  shareseller: text('share_seller').notNull(),
  sharenetpro: text('share_netpro').notNull(),
  shareprice: text('share_price').notNull(),
});

export const supplyProduct = sqliteTable('supply_product', {
  id: integer('id').notNull().primaryKey(),
  productid: integer('product_id')
    .notNull()
    .references(() => product.productId),
  qty: text('qty').notNull(),
  unitcost: text('unit_cost'),
  datex: text('date').notNull(),
});
export const supplyProductOffline = sqliteTable('supply_product', {
  id: integer('id').notNull().primaryKey(),
  productid: integer('product_id')
    .notNull()
    .references(() => product.productId),
  qty: text('qty').notNull(),
  unitcost: text('unit_cost'),
  datex: text('date').notNull(),
});
export const supplyRelation = relations(supplyProduct, ({ one }) => ({
  product: one(product, {
    fields: [supplyProduct.productid],
    references: [product.productId],
  }),
}));
export const cart = sqliteTable('cart', {
  id: integer('id').notNull().primaryKey(),
  salesReference: text('sales_reference')
    .notNull()
    .$default(() => createId() + sql`CURRENT_TIMESTAMP`),
});

export const cartItem = sqliteTable('cart_item', {
  id: integer('id').notNull().primaryKey(),
  productId: text('product_id').references(() => product.productId),
  qty: integer('qty').notNull(),
  cartId: integer('cart_id').references(() => cart.id),
  unitCost: integer('unit_cost').notNull(),
});
export const cartItemProduct = relations(cartItem, ({ one }) => ({
  product: one(product, {
    fields: [cartItem.productId],
    references: [product.productId],
  }),
}));
export const cartCartItemRelation = relations(cart, ({ many }) => ({
  cartItem: many(cartItem),
}));
export const cartItemCartRelation = relations(cartItem, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItem.cartId],
    references: [cart.id],
  }),
}));
export type supplyProductSelect = typeof supplyProduct.$inferSelect;
export type supplyProductInsert = typeof supplyProduct.$inferInsert;
export type DisposedSelect = typeof disposedProducts.$inferSelect;
export type CategorySelect = typeof category.$inferSelect;
export type CategoryInsert = typeof category.$inferInsert;
export type PharmacyType = typeof pharmacyInfo.$inferInsert;
export type PharmacySelect = typeof pharmacyInfo.$inferSelect;
export type ExpenseInsert = typeof expenses.$inferInsert;
export type ExpenseSelect = typeof expenses.$inferSelect;
export type ExpenseAccount = typeof expenseAccount.$inferSelect;

export type SalesP = typeof pharmacySales.$inferInsert;
export type SalesPSelect = typeof pharmacySales.$inferSelect;
export type SalesPInsert = typeof pharmacySales.$inferInsert;
export type SalesS = typeof storeSales.$inferInsert;
export type SalesSSelect = typeof storeSales.$inferSelect;
export type ProductSelect = typeof product.$inferSelect;
export type ProductInsert = typeof product.$inferInsert;
export type StaffInsert = typeof staff.$inferInsert;
export type StaffSelect = typeof staff.$inferSelect;
