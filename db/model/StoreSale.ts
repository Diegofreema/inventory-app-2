import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators';

import Product from './Product';
import Staff from './Staff';
export default class StoreSales extends Model {
  static table = 'store_sales';

  @relation('products', 'product_id') products!: Product;
  @relation('staffs', 'id') staff!: Staff;
  @text('product_id') productId!: string;
  @field('qty') qty!: number;
  @field('unit_price') unitPrice!: number;
  @text('date') dateX!: string;
  @text('sales_reference') salesReference!: string;
  @text('payment_type') paymentType!: string;
  @text('transfer_info') transferInfo!: string;
  @field('is_paid') isPaid!: boolean;
  @text('user_id') userId!: string;
  @text('cid') cid!: string;
  @field('is_uploaded') isUploaded!: boolean;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}
