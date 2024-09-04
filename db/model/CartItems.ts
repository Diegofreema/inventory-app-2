import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators';

import Product from './Product';
export default class CartItem extends Model {
  static table = 'cart_items';

  @relation('products', 'product_id') product!: Product;
  @field('cart_id') cartId!: number;
  @text('product_id') productId!: string;
  @field('qty') qty!: number;
  @field('unit_cost') unitCost!: number;
  @text('sales_reference') salesReference!: string;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}
