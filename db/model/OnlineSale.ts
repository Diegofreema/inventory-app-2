import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, text } from '@nozbe/watermelondb/decorators';

export default class OnlineSale extends Model {
  static table = 'online_sales';

  @text('name') name!: string;
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
