/* eslint-disable prettier/prettier */
import { zodResolver } from "@hookform/resolvers/zod";
import { Q } from "@nozbe/watermelondb";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, FlatList, useWindowDimensions } from "react-native";
import { toast } from "sonner-native";
import { View, XStack } from "tamagui";
import { z } from "zod";

import { ExtraDataForm } from "./ExtraDataForm";
import { AnimatedCard } from "./ui/AnimatedCard";
import { FlexText } from "./ui/FlexText";
import { MyButton } from "./ui/MyButton";
import { Empty } from "./ui/empty";

import database, { cartItems, products, saleReferences } from "~/db";
import CartItem from "~/db/model/CartItems";
import { useSalesRef } from "~/hooks/useSalesRef";
import { trimText } from "~/lib/helper";
import { useCart } from "~/lib/tanstack/mutations";
import { extraDataSchema } from "~/lib/validators";
import { ExtraSalesType } from "~/type";


type Props = {
  data: CartItem[];
};

export const CartFlatList = ({ data }: Props): JSX.Element => {
  const { mutateAsync, isError } = useCart();
  const [ref, setRef] = useState('');
  const queryClient = useQueryClient();
  const {width} = useWindowDimensions()
const salesRefs = useSalesRef(state => state.saleRefs)
  const refToPrint = salesRefs.find((r) => r === ref)
  const {
    formState: { errors, isSubmitting },
    reset,
    handleSubmit, control,
    setValue,
    watch
  } = useForm<z.infer<typeof extraDataSchema>>({
    defaultValues: {
      paymentType: 'Cash',
      transferInfo: '',
    },

    resolver: zodResolver(extraDataSchema),
  });
  const salesRepId = SecureStore.getItem('staffId') || '';
const {paymentType} = watch()
  const onSubmit = async (values: z.infer<typeof extraDataSchema>) => {
    const extraData: ExtraSalesType = {
      paymentType: values.paymentType,
      salesRepId,
      transactionInfo: values.transferInfo,
    };
    await mutateAsync({ data, extraData });
    setRef(data[0].salesReference)
    if (!isError) {
      reset();
    }
  };
  const totalPrice = data.reduce((acc, cur) => acc + Number(cur?.unitCost) * Number(cur?.qty), 0);
  const disable = !data?.length;

  const isLoading = useMemo(() => isSubmitting, [isSubmitting]);
  const onClearCart = async () => {
    try {
      const items = await cartItems
        .query(Q.where('sales_reference', Q.eq(data[0].salesReference)))
        .fetch();
      const refs = await saleReferences
        .query(Q.where('sale_reference', Q.eq(data[0].salesReference)))
        .fetch();
      await database.write(async () => {
        for (const ref1 of refs) {
          await ref1.destroyPermanently();
        }
      });

      await database.write(async () => {
        for (const item of items) {
          await item.destroyPermanently();
        }
      });

      queryClient.invalidateQueries({ queryKey: ['cart_item_ref'] });
      queryClient.invalidateQueries({ queryKey: ['sales_ref'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    } catch (error) {
      console.log(error);
    }
  };
const isCash = paymentType === 'Cash';
  const isMid = width < 768;
  const isSmall = width < 425;

  const finalWidth = isSmall ? '100%' : isMid ? '100%' : '80%';
  return (
    <View width={finalWidth} mx="auto" flex={1}>
      <FlatList
        data={data}
        ListHeaderComponent={() => <FlexText text="Total" text2={`₦${totalPrice}`} />}
        renderItem={({ item, index }) => <CartCard item={item} index={index} />}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 20, paddingBottom: 20, flexGrow: 1 }}
        ListEmptyComponent={() => <Empty text="No item in cart" />}
        keyExtractor={(item, index) => index.toString()}
        scrollEnabled={false}
      />
      <View gap={10} mb={10}>
        <ExtraDataForm isCash={isCash} control={control} errors={errors} setValue={setValue} />
        <XStack gap={10} mb={15}>
          <MyButton
            backgroundColor="red"
            title="Clear cart"
            marginTop={30}
            height={50}
            onPress={onClearCart}
            disabled={disable}
            flex={1}
          />
          <MyButton
            title="Checkout"
            marginTop={30}
            height={50}
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            disabled={isLoading || disable}
            flex={1}
          />
        </XStack>
        {refToPrint &&<MyButton title='Print' height={60} onPress={() => router.push(`/print?ref=${refToPrint}`)} />}
      </View>
    </View>
  );
};

const CartCard = ({ item, index }: { item: CartItem; index: number }) => {
  const queryClient = useQueryClient();


  const onAdd = async () => {
    if (!item?.productId) return toast.error('Error',{ description: 'Could' +
        ' not add item' });

  try{
    const productQty = await products.query(Q.where('product_id', item.productId), Q.take(1)).fetch()
    const singleProduct = productQty[0]


    if (singleProduct && singleProduct.qty <= item.qty) {
      return toast.info('Cannot update item',{
        description: `Only ${singleProduct.qty} Item(s)  is left in stock`,
      });
    }
    await database.write(async () => {
      const itemToUpdate = await cartItems.find(item.id);
      if(!itemToUpdate) return Alert.alert('Product not found', item.id)
      itemToUpdate.update((i) => {
        i.qty = item.qty + 1;
      });
    });

    queryClient.invalidateQueries({ queryKey: ['cart_item_ref'] });
  }catch (e) {
    console.log(e);
  }
  };
  const onReduce = async () => {
    if (item?.qty! > 1) {
      await database.write(async () => {
        const itemToUpdate = await cartItems.find(item.id);


        itemToUpdate.update((i) => {
          i.qty = item.qty - 1;
        });
      });

      queryClient.invalidateQueries({ queryKey: ['cart_item_ref'] });
    } else {
      await database.write(async () => {
        const itemToDelete = await cartItems.find(item.id);
        itemToDelete.destroyPermanently();
      });

      queryClient.invalidateQueries({ queryKey: ['cart_item_ref'] });
    }
  };
  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={trimText(item?.name, 25)} />
      <FlexText text="Price" text2={`₦${item?.unitCost!}`} />
      <FlexText text="Quantity" text2={item?.qty.toString()} />
      <XStack marginTop={5} gap={10}>
        <MyButton title="Remove" flex={1} onPress={onReduce} backgroundColor='red' />
        <MyButton title="Add" flex={1} onPress={onAdd} />
      </XStack>
    </AnimatedCard>
  );
};
