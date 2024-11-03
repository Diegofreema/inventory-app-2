import axios from 'axios';
import { useEffect } from 'react';

import database, { updateProducts } from '~/db';
import { useNetwork } from '~/hooks/useNetwork';

export const useUpdateProduct = () => {
  const isConnected = useNetwork();
  useEffect(() => {
    const fetchDataAndUpload = async () => {
      const data = await updateProducts.query().fetch();
      console.log(data.length);
      if (data.length > 0) {
        for (const item of data) {
          axios
            .get(
              `https://247api.netpro.software/api.aspx?api=updateproductpricenqty&qty=${item.qty}&customerproductid=${item.customerProductId}&online=${item.online ? '1' : '0'}&price=${item.marketPrice}&getsellingprice=${item.sellingPrice}&getdealershare=${item.shareDealer}&getnetproshare=${item.shareNetpro}&productid=${item.productId}`
            )
            .then(async () => {
              await database.write(async () => {
                for (const item1 of data) {
                  await database.batch(item1.prepareDestroyPermanently());
                }
              });
            });
        }
      }
    };
    if (isConnected) {
      fetchDataAndUpload().then((r) => console.log(r));
    }
  }, [isConnected]);
};
