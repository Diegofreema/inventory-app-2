import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, text } from '@nozbe/watermelondb/decorators';

export default class DisposedProducts extends Model {
  static table = 'disposed_products';

  @text('product_id') productId!: string;
  @field('qty') qty!: number;
  @field('unit_cost') unitCost!: number;
  @text('date') dateX!: string;
  @field('is_uploaded') isUploaded!: boolean;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}
