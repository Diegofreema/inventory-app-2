import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import database, { updateProducts } from '~/db';

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return async () => {
    const data = await updateProducts.query().fetch();
    console.log(data.length, 'updateProduct');
    if (data.length > 0) {
      for (const item of data) {
        axios
          .get(
            `https://247api.netpro.software/api.aspx?api=updateproductpricenqty&qty=${item.qty}&customerproductid=${item.customerProductId}&online=${item.online ? 1 : 0}&price=${item.marketPrice}&getsellingprice=${item.sellingPrice}&getdealershare=${item.shareDealer}&getnetproshare=${item.shareNetpro}&productid=${item.productId}`
          )
          .then(async () => {
            await database
              .write(async () => {
                for (const item1 of data) {
                  await database.batch(item1.prepareDestroyPermanently());
                }
              })
              .then(() => {
                queryClient.invalidateQueries({ queryKey: ['offline_online_status'] });
              })
              .catch((e) => console.log(e));
          });
      }
    }
  };
};
