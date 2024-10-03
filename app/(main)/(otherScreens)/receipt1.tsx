import { Q } from '@nozbe/watermelondb';
import * as Print from 'expo-print';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { Separator, YStack } from 'tamagui';

import { Container } from '~/components/Container';
import { AnimatedCard } from '~/components/ui/AnimatedCard';
import { Error } from '~/components/ui/Error';
import { FlexText } from '~/components/ui/FlexText';
import { ProductLoader } from '~/components/ui/Loading';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { products } from '~/db';
import { trimText } from '~/lib/helper';
import { useAdd247, usePickUp } from '~/lib/tanstack/mutations';
import { useReceipt1, useReceipt2 } from '~/lib/tanstack/queries';
import { Receipt2Type } from '~/type';

const Receipt1 = () => {
  const { ref } = useLocalSearchParams<{ ref: string }>();
  const { data, isPending, isError, refetch } = useReceipt1(ref);
  const { mutateAsync, isPending: isPendingPickUp } = usePickUp();
  const { mutateAsync: onAddOnline, isPending: isPendingAddOnline } = useAdd247();

  const {
    data: data2,
    isPending: isPending2,
    isError: isError2,
    refetch: refetch2,
  } = useReceipt2(ref);
  console.log({ data, data2 });

  const [printing, setPrinting] = useState(false);
  const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
   <div style="width: 100%; display: flex; flex-direction: column; justify-content: space-between; align-items: center; margin-top: 10px;">
   <img src='https://247pharmacy.net/images/247pharmacy.png' style="width: 200px; height: 200px; margin-bottom: 5px; object-fit: contain;" />
   <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal; margin-bottom: 5px;">
      www.247pharmacy.net
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        support@247pharmacy.net
      </h1>
    </div>
  <div style='width: 80%; margin: 0 auto;'>
    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Customer name
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ${data?.customername}
      </h1>
    </div>
    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Address
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ${data?.addres}
      </h1>
    </div>
    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Customer Community
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ${data?.customerCommunity}
      </h1>
    </div>
    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        State
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ${data?.statename}
      </h1>
    </div>
    <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Phone
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ${data?.phone}
      </h1>
    </div>
    
 <div style='gap: 10px;'>
    ${
      data2
        ? data2
            .map(
              (d) => `
      <div style="margin-bottom: 15px; border-bottom: 1px solid black;">
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
          <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
            Product
          </h1>
          <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
            ${d.Product || ''}
          </h1>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
          <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
            Quantity
          </h1>
          <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
            ${d.qty || ''}
          </h1>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
          <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
            Price
          </h1>
          <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
            ₦${d.unitprice || ''}
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
        Delivery fee
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ₦${data?.customerCommunityFee}
      </h1>
    </div>
      <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Total cost
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ₦${(Number(data?.totalsale) || 0) + (Number(data?.customerCommunityFee) || 0)}
      </h1>
    </div>
    <div style="width: 100%;">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Tracking ref
      </h1>
      <h1 style="font-size: 20px; font-family: Helvetica Neue; font-weight: bold;">
        ${ref}
      </h1>
    </div>
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

  const handleRefetch = () => {
    refetch();
    refetch2();
  };
  if (isError || isError2) {
    return <Error onRetry={handleRefetch} />;
  }

  if (isPending || isPending2) {
    return <ProductLoader />;
  }

  const handlePickUp = async () => {
    console.log(data2);
    await mutateAsync({
      ref,
      communityId: data?.community,
      fee: data?.customerCommunityFee,
      state: data?.statename,
    });
    data2.forEach(async (d) => {
      const product = await products
        .query(Q.where('product_id', Q.eq(d.productid)), Q.take(1))
        .fetch();
      const singleProduct = product[0];
      onAddOnline({ productId: singleProduct.id, qty: +d.qty, unitPrice: +d.unitprice });
      // const product = await products
      //   .query(Q.where('product_id', Q.eq(d.productid)), Q.take(1))
      //   .fetch();
      // const singleProduct = product[0];
      // await database.write(async () => {
      //   const pd = await products.find(singleProduct.id);
      //   await pd.update((p) => {
      //     p.qty = p.qty - Number(d.qty);
      //   });
      // });
    });
  };

  return (
    <Container>
      <NavHeader title="Receipt" />
      <AnimatedCard index={4}>
        <FlexText text="Name" text2={data?.customername} />
        <FlexText text="Address" text2={trimText(data?.addres, 22)} />
        <FlexText text="Phone" text2={data?.phone} />
        <FlexText text="State" text2={data?.statename} />
        <FlexText text="Community" text2={trimText(data?.customerCommunity, 22)} />
        <FlexText text="Delivery Fee" text2={`₦${data?.customerCommunityFee}`} />

        <Separator my={10} />
        <FlatList
          data={data2}
          renderItem={({ item }) => <DataCard {...item} />}
          keyExtractor={(item) => item.productid}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10 }}
          ItemSeparatorComponent={() => <Separator my={10} />}
          ListFooterComponent={() => <FlexText text="Total Sale" text2={`₦${data?.totalsale}`} />}
          ListFooterComponentStyle={{
            marginTop: 20,
            borderTopWidth: 1,
            borderTopColor: 'black',
            paddingTop: 10,
          }}
        />
        <YStack mt={10} gap={10}>
          <MyButton title="Print" onPress={print} loading={printing} />
          <MyButton
            title="Call for pickup"
            loading={isPendingPickUp || isPendingAddOnline}
            onPress={handlePickUp}
          />
        </YStack>
      </AnimatedCard>
    </Container>
  );
};

export default Receipt1;

const DataCard = ({ Product, qty, unitprice }: Receipt2Type) => {
  return (
    <YStack>
      <FlexText text="Product" text2={Product} />
      <FlexText text="Quantity" text2={qty} />
      <FlexText text="Unit Price" text2={`₦${unitprice}`} />
    </YStack>
  );
};
