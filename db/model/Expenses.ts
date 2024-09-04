import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, text } from '@nozbe/watermelondb/decorators';
export default class Expenses extends Model {
  static table = 'expenses';

  @text('account_name') accountName!: string;
  @text('date') dateX!: string;
  @text('description') description!: string;
  @field('amount') amount!: number;
  @field('is_uploaded') isUploaded!: boolean;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}
