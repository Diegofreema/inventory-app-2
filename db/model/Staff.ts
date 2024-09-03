import { Model } from '@nozbe/watermelondb';
import { text } from '@nozbe/watermelondb/decorators';
export default class Staff extends Model {
  static table = 'staffs';

  @text('name') name!: string;
  @text('email') email!: string;
  @text('password') password!: string;
  @text('pharmacy_id') pharmacyId!: string;
}
