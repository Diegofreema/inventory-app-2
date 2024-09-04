import { Model } from '@nozbe/watermelondb';
import { date, readonly, text } from '@nozbe/watermelondb/decorators';
export default class Categories extends Model {
  static table = 'categories';

  @text('category') category!: string;
  @text('subcategory') subcategory!: string;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}
