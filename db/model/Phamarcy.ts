import { Model } from '@nozbe/watermelondb';
import { date, readonly, text } from '@nozbe/watermelondb/decorators';
export default class PharmacyInfo extends Model {
  static table = 'pharmacy_info';

  @text('state_name') stateName!: string;
  @text('business_name') businessName!: string;
  @text('share_seller') shareSeller!: string;
  @text('share_netpro') shareNetpro!: string;
  @text('share_price') sharePrice!: string;
  @readonly @date('created_at') createdAt!: number;
  @readonly @date('updated_at') updatedAt!: number;
}
