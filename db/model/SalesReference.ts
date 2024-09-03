import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';
export default class SaleReference extends Model {
  static table = 'sale_references';

  @text('sale_reference') saleReference!: string;
  @field('is_active') isActive!: boolean;
}
