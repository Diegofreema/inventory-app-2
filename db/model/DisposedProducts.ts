import { Model } from '@nozbe/watermelondb';
import { field, relation, text } from '@nozbe/watermelondb/decorators';

import Product from './Product';
export default class DisposedProducts extends Model {
  static table = 'disposed_products';

  @relation('products', 'product_id') product!: Product;
  @text('product_id') productId!: string;
  @field('qty') qty!: number;
  @field('unit_cost') unitCost!: number;
  @text('date') dateX!: string;
  @field('is_uploaded') isUploaded!: boolean;
}
