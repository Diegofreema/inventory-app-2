import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import database, { updateProducts } from '~/db';

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return async () => {
    const data = await updateProducts.query().fetch();
    console.log(data.length, 'updateProduct');
    if (data.length > 0) {
      try {
        for (const item of data) {
          try {
            // Make API request sequentially
            await axios.get(
              `https://247api.netpro.software/api.aspx?api=updateproductpricenqty&qty=${item.qty}&customerproductid=${item.customerProductId}&online=${item.online ? 1 : 0}&price=${item.marketPrice}&getsellingprice=${item.sellingPrice}&getdealershare=${item.shareDealer}&getnetproshare=${item.shareNetpro}&productid=${item.productId}`
            );
            // Prepare and execute database operation for each item
            await database.write(async () => {
              await database.batch(item.prepareDestroyPermanently());
            });
          } catch (itemError) {
            console.error('Error processing item:', itemError);
            // Optionally: decide whether to continue or break the loop
          }
        }

        // Invalidate queries after all items are processed
        queryClient.invalidateQueries({ queryKey: ['offline_online_status'] });
      } catch (error) {
        console.error('Overall operation failed:', error);
      }
    }
  };
};
