import { Model } from '@nozbe/watermelondb';
import { text } from '@nozbe/watermelondb/decorators';
export default class Categories extends Model {
  static table = 'categories';

  @text('category') category!: string;
  @text('subcategory') subcategory!: string;
}
