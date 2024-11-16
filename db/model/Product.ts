import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, text } from '@nozbe/watermelondb/decorators';
export default class Product extends Model {
  static table = 'products';

  @text('product_id') productId!: string;
  @text('category') category!: string;
  @text('subcategory') subcategory!: string;
  @text('customer_product_id') customerProductId!: string;
  @field('market_price') marketPrice!: number;
  @field('online') online!: boolean;
  @text('product') product!: string;
  @text('description') description!: string;
  @field('qty') qty!: number;
  @field('selling_price') sellingPrice!: number;
  @field('share_dealer') shareDealer!: number;
  @field('share_netpro') shareNetpro!: number;
  @field('is_uploaded') isUploaded!: boolean;

  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}
