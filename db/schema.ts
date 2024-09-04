// /* eslint-disable prettier/prettier */

import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'products',
      columns: [
        { name: 'product_id', type: 'string' },
        { name: 'category', type: 'string' },
        { name: 'subcategory', type: 'string' },
        { name: 'customer_product_id', type: 'string', isOptional: true },
        { name: 'market_price', type: 'number', isOptional: true },
        { name: 'online', type: 'boolean' },
        { name: 'product', type: 'string' },
        { name: 'description', type: 'string' },
        { name: 'qty', type: 'number' },
        { name: 'selling_price', type: 'number' },
        { name: 'share_dealer', type: 'number' },
        { name: 'share_netpro', type: 'number' },
        { name: 'is_uploaded', type: 'boolean', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'staffs',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'password', type: 'string' },
        { name: 'pharmacy_id', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'online_sales',
      columns: [
        { name: 'product_id', type: 'string' },
        {
          name: 'qty',
          type: 'number',
        },
        { name: 'unit_price', type: 'number' },
        { name: 'date', type: 'string' },
        { name: 'dealer_share', type: 'number' },
        { name: 'netpro_share', type: 'number' },
        { name: 'is_uploaded', type: 'boolean', isOptional: true },
        { name: 'name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'disposed_products',
      columns: [
        { name: 'product_id', type: 'string' },
        { name: 'qty', type: 'number' },
        { name: 'date', type: 'string' },
        { name: 'unit_cost', type: 'number' },
        { name: 'is_uploaded', type: 'boolean', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'name', type: 'string' },
      ],
    }),

    tableSchema({
      name: 'store_sales',
      columns: [
        { name: 'product_id', type: 'string' },
        { name: 'date', type: 'string' },
        { name: 'unit_price', type: 'number' },
        { name: 'qty', type: 'number' },
        { name: 'sales_reference', type: 'string' },
        { name: 'payment_type', type: 'string' },
        { name: 'transfer_info', type: 'string', isOptional: true },
        { name: 'is_paid', type: 'boolean', isOptional: true },
        { name: 'user_id', type: 'string', isOptional: true },
        { name: 'cid', type: 'string', isOptional: true },
        { name: 'is_uploaded', type: 'boolean', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'name', type: 'string' },
      ],
    }),

    tableSchema({
      name: 'expense_accounts',
      columns: [
        { name: 'account_name', type: 'string' },
        { name: 'is_uploaded', type: 'boolean', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'expenses',
      columns: [
        { name: 'account_name', type: 'string' },
        { name: 'date', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'amount', type: 'number' },
        { name: 'is_uploaded', type: 'boolean', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'categories',
      columns: [
        { name: 'category', type: 'string' },
        { name: 'subcategory', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'pharmacy_info',
      columns: [
        { name: 'state_name', type: 'string' },
        { name: 'business_name', type: 'string' },
        { name: 'share_seller', type: 'string' },
        { name: 'share_netpro', type: 'string' },
        { name: 'share_price', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'supply_products',
      columns: [
        { name: 'product_id', type: 'string' },
        { name: 'qty', type: 'number' },
        { name: 'unit_cost', type: 'number' },
        { name: 'date', type: 'string' },
        { name: 'is_uploaded', type: 'boolean', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'name', type: 'string' },
      ],
    }),

    tableSchema({
      name: 'sale_references',
      columns: [
        { name: 'sale_reference', type: 'string' },
        { name: 'is_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),

    tableSchema({
      name: 'cart_items',
      columns: [
        { name: 'product_id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'qty', type: 'number' },
        { name: 'cart_id', type: 'number' },
        { name: 'unit_cost', type: 'number' },
        { name: 'sales_reference', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
