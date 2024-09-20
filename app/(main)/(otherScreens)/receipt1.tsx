import * as Print from 'expo-print';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Separator, YStack } from 'tamagui';

import { Container } from '~/components/Container';
import { AnimatedCard } from '~/components/ui/AnimatedCard';
import { Error } from '~/components/ui/Error';
import { FlexText } from '~/components/ui/FlexText';
import { ProductLoader } from '~/components/ui/Loading';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { trimText } from '~/lib/helper';
import { usePickUp } from '~/lib/tanstack/mutations';
import { useReceipt1, useReceipt2 } from '~/lib/tanstack/queries';

const Receipt1 = () => {
  const { ref } = useLocalSearchParams<{ ref: string }>();
  const { data, isPending, isError, refetch } = useReceipt1(ref);
  const { mutateAsync, isPending: isPendingPickUp } = usePickUp();
  const {
    data: data2,
    isPending: isPending2,
    isError: isError2,
    refetch: refetch2,
  } = useReceipt2(ref);
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
    
    
   <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Product
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ${data2?.Product}
      </h1>
    </div>
   <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Quantity
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ${data2?.qty}
      </h1>
    </div>
     <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Price
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ₦${data2?.unitprice}
      </h1>
    </div>
     <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Total cost
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ₦${data?.totalsale}
      </h1>
    </div>
     <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: normal;">
        Total cost
      </h1>
      <h1 style="font-size: 25px; font-family: Helvetica Neue; font-weight: bold;">
        ₦${data?.customerCommunityFee}
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
    await mutateAsync({
      ref,
      communityId: data?.community,
      fee: data?.customerCommunityFee,
      state: data?.statename,
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
        <FlexText text="Total Sale" text2={`₦${data?.totalsale}`} />
        <Separator my={10} />
        <FlexText text="Product" text2={data2?.Product} />
        <FlexText text="Quantity" text2={data2?.qty} />
        <FlexText text="Unit Price" text2={`₦${data2?.unitprice}`} />
        <YStack mt={10} gap={10}>
          <MyButton title="Print" onPress={print} loading={printing} />
          <MyButton title="Call for pickup" loading={isPendingPickUp} onPress={handlePickUp} />
        </YStack>
      </AnimatedCard>
    </Container>
  );
};

export default Receipt1;
