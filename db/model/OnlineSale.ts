import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators';

import Product from './Product';
export default class OnlineSale extends Model {
  static table = 'online_sales';

  @relation('products', 'product_id') product!: Product;
  @text('product_id') productId!: string;
  @field('qty') qty!: number;
  @field('unit_price') unitPrice!: number;
  @text('date') dateX!: string;
  @field('dealer_share') dealerShare!: number;
  @field('netpro_share') netProShare!: number;
  @field('is_uploaded') isUploaded!: boolean;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}
