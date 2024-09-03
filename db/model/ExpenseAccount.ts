import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';
export default class ExpenseAccount extends Model {
  static table = 'expense_accounts';

  @text('account_name') accountName!: string;
  @field('is_uploaded') isUploaded!: boolean;
}
