import { Q } from '@nozbe/watermelondb';
import * as Print from 'expo-print';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

import { Container } from '~/components/Container';
import { SalesFlatlist } from '~/components/sales/SalesFlatlist';
import { Error } from '~/components/ui/Error';
import { Loading } from '~/components/ui/Loading';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { pharmacyInfo, products } from "~/db";
import { totalAmount } from '~/lib/helper';
import { useSalesToPrint } from '~/lib/tanstack/queries';
type FormattedProps = {
  qty: number;
  name: string;
  unitPrice: number;
};
const PrintScreen = () => {
  const { ref } = useLocalSearchParams<{ ref: string }>();
  const { data, isPending, refetch, isError } = useSalesToPrint(ref);
  const [printing, setPrinting] = useState(false);
  const [name, setName] = useState('');
  const [formattedProduct, setFormattedProduct] = useState<FormattedProps[]>();

  useEffect(() => {
    const fetchProductName = async (id: string) => {
      const product = await products.query(Q.where('product_id', Q.eq(id)), Q.take(1)).fetch();
      return product[0].product;
    };

    const getDataWithName = async () => {
      if (!data) return [];
      const info = await pharmacyInfo.query().fetch();
      setName(info?.[0]?.businessName)
      return await Promise.all(
        data.map(async (d) => {
          const name = await fetchProductName(d.productId);
          return {
            qty: d.qty,
            name,
            unitPrice: d.unitPrice,
          };
        })
      );
    };

    // IIFE (Immediately Invoked Function Expression) to handle the async operation
    (async () => {
      try {
        const formattedData = await getDataWithName();
        setFormattedProduct(formattedData);
      } catch (error) {
        console.error('Error formatting product data:', error);
        // Handle error appropriately
      }
    })();
  }, [data]);

  if (isError) {
    return <Error onRetry={refetch} />;
  }
  if (isPending) {
    return <Loading />;
  }
  const total = data?.map((d) => d.unitPrice * d.qty);
  const totalSales = totalAmount(total || [0]);
  const html = `
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <title>print</title>
  </head>
  <body style="text-align: center;">
   <div style="width: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; margin-top: 10px;">
<!--   <img src='https://247pharmacy.net/images/247pharmacy.png' style="width: 200px; height: 200px; margin-bottom: 5px; object-fit: contain;"  alt="image"/>-->
   <h1 style="font-size: 25px; font-family: Helvetica Neue,serif; font-weight: normal; margin-bottom: 5px;">
      www.247pharmacy.net
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue,serif; font-weight: normal;">
        support@247pharmacy.net
      </h1>
    </div>
  <div style='width: 80%; margin: 0 auto;'>
  
   
    
    
 <div style='gap: 10px;'>
    ${
      formattedProduct
        ? formattedProduct
            .map(
              (d) => `
                  <div style="margin-bottom: 15px; border-bottom: 1px solid black;">
                    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                      <h1 style="font-size: 25px; font-family: Helvetica Neue,serif; font-weight: normal;">
                        Product
                      </h1>
                      <h1 style="font-size: 25px; font-family: Helvetica Neue, serif; font-weight: bold; max-width: 25ch; text-align: left">
                        ${d.name || ''}
                      </h1>
                    </div>
                    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                      <h1 style="font-size: 25px; font-family: Helvetica Neue, serif; font-weight: normal;">
                        Quantity
                      </h1>
                      <h1 style="font-size: 25px; font-family: Helvetica Neue, serif; font-weight: bold;">
                        ${d.qty || ''}
                      </h1>
                    </div>
                    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
                      <h1 style="font-size: 25px; font-family: Helvetica Neue, serif; font-weight: normal;">
                        Price
                      </h1>
                      <h1 style="font-size: 25px; font-family: Helvetica Neue, serif; font-weight: bold;">
                        ₦${d.unitPrice || ''}
                      </h1>
                    </div>
                  </div>
                `
            )
            .join('')
        : ''
    }
 </div>
      <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Total cost
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ₦${totalSales}
    </div>
      </h1> 
       <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
      ${name}
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
       Powered by 247Inventory
      </h1>
   
  </div>
  <script>
</script>
  </body>
</html>
`;
  const print = async () => {
    setPrinting(true);
    try {
      await Print.printAsync({
        html,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setPrinting(false);
    }
  };
  return (
    <Container>
      <NavHeader title="Print" />
      <SalesFlatlist
        // @ts-ignore
        data={data}
        isLoading={isPending}
        refetch={refetch}
        pagination={<MyButton title="Print" onPress={print} height={55} loading={printing} />}
      />
    </Container>
  );
};
export default PrintScreen;
