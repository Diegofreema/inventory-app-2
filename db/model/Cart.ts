import { Model } from '@nozbe/watermelondb';
import { Associations } from '@nozbe/watermelondb/Model';
import { text } from '@nozbe/watermelondb/decorators';
export default class Cart extends Model {
  static table = 'carts';
  static associations: Associations = {
    cart_item: { type: 'has_many', foreignKey: 'cart_id' },
  };
  @text('cart_id') cartId!: number;
}
