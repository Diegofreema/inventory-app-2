import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';
export default class Expenses extends Model {
  static table = 'expenses';

  @text('account_name') accountName!: string;
  @text('date') dateX!: string;
  @text('description') description!: string;
  @field('amount') amount!: number;
  @field('is_uploaded') isUploaded!: boolean;
}
