/* eslint-disable prettier/prettier */
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import * as SecureStore from 'expo-secure-store';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList } from 'react-native';
import { XStack } from 'tamagui';
import { z } from 'zod';

import { ExtraDataForm } from './ExtraDataForm';
import { AnimatedCard } from './ui/AnimatedCard';
import { FlexText } from './ui/FlexText';
import { MyButton } from './ui/MyButton';
import { Empty } from './ui/empty';

import { CartItemSelect, ProductSelect } from '~/db/schema';
import { useDrizzle } from '~/hooks/useDrizzle';
import { trimText } from '~/lib/helper';
import { useCart } from '~/lib/tanstack/mutations';
import { extraDataSchema } from '~/lib/validators';
import { ExtraSalesType } from '~/type';
import Toast from 'react-native-toast-message';

export type CartItemWithProductField = CartItemSelect & { product: ProductSelect };
type Props = {
  data: CartItemWithProductField[];
};

export const CartFlatList = ({ data }: Props): JSX.Element => {
  const { mutateAsync, isError } = useCart();
  const queryClient = useQueryClient();
  const { db, schema } = useDrizzle();
  const {
    formState: { errors, isSubmitting },
    reset,
    handleSubmit,
    control,
    setValue,
  } = useForm<z.infer<typeof extraDataSchema>>({
    defaultValues: {
      paymentType: 'Cash',
      transferInfo: '',
    },

    resolver: zodResolver(extraDataSchema),
  });
  const salesRepId = Number(SecureStore.getItem('staffId')) || 0;

  const onSubmit = async (values: z.infer<typeof extraDataSchema>) => {
    const extraData: ExtraSalesType = {
      paymentType: values.paymentType,
      salesRepId,
      transactionInfo: values.transferInfo,
    };
    await mutateAsync({ data, extraData });
    if (!isError) {
      reset();
    }
  };
  const totalPrice = data.reduce(
    (acc, cur) => acc + Number(cur?.product.sellingPrice) * Number(cur?.qty),
    0
  );
  const disable = !data?.length;

  const isLoading = useMemo(() => isSubmitting, [isSubmitting]);
  const onClearCart = async () => {
    await db
      .delete(schema.cartItem)
      .where(eq(schema.cartItem.salesReference, data[0]?.salesReference));
    await db
      .delete(schema.salesReference)
      .where(eq(schema.salesReference.salesReference, data[0]?.salesReference));
    queryClient.invalidateQueries({ queryKey: ['cart_item'] });
    queryClient.invalidateQueries({ queryKey: ['sales_ref'] });
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  };

  return (
    <FlatList
      data={data}
      ListHeaderComponent={() => <FlexText text="Total" text2={`₦${totalPrice}`} />}
      renderItem={({ item, index }) => <CartCard item={item} index={index} />}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20, flexGrow: 1 }}
      ListEmptyComponent={() => <Empty text="No item in cart" />}
      keyExtractor={(item, index) => index.toString()}
      ListFooterComponent={() => (
        <>
          <ExtraDataForm control={control} errors={errors} setValue={setValue} />

          <XStack gap={10}>
            <MyButton
              bg="red"
              title="Clear cart"
              mt={30}
              height={50}
              onPress={onClearCart}
              disabled={disable}
              flex={1}
            />
            <MyButton
              title="Checkout"
              mt={30}
              height={50}
              onPress={handleSubmit(onSubmit)}
              loading={isLoading}
              disabled={isLoading || disable}
              flex={1}
            />
          </XStack>
        </>
      )}
      ListFooterComponentStyle={{ marginTop: 'auto', marginBottom: 30 }}
    />
  );
};

const CartCard = ({ item, index }: { item: CartItemWithProductField; index: number }) => {
  const { db, schema } = useDrizzle();
  const queryClient = useQueryClient();
  console.log(item.productId, 'sahjbdhsaj');

  const onAdd = async () => {
    if (!item?.productId) return Toast.show({ text1: 'Error', text2: 'Could not add item' });
    const productQty = await db.query.product.findFirst({
      where: eq(schema.product.productId, item?.productId),
      columns: {
        qty: true,
      },
    });
    if (productQty && productQty?.qty <= item.qty) {
      return Toast.show({
        text1: 'Cannot update item',
        text2: `Only ${productQty.qty} Item  is left in stock`,
      });
    }

    await db
      .update(schema.cartItem)
      .set({ qty: item?.qty! + 1 })
      .where(eq(schema.cartItem.id, item?.id));
    queryClient.invalidateQueries({ queryKey: ['cart_item'] });
  };
  const onReduce = async () => {
    if (item?.qty! > 1) {
      await db
        .update(schema.cartItem)
        .set({ qty: item?.qty! - 1 })
        .where(eq(schema.cartItem.id, item?.id));
      queryClient.invalidateQueries({ queryKey: ['cart_item'] });
    } else {
      await db.delete(schema.cartItem).where(eq(schema.cartItem.id, item?.id));
      queryClient.invalidateQueries({ queryKey: ['cart_item'] });
    }
  };
  return (
    <AnimatedCard index={index}>
      <FlexText text="Product" text2={trimText(item?.product.product, 25)} />
      <FlexText text="Price" text2={`₦${item?.product.sellingPrice!}`} />
      <FlexText text="Quantity" text2={item?.qty.toString()} />
      <XStack mt={5} gap={10}>
        <MyButton title="Remove" flex={1} onPress={onReduce} />
        <MyButton title="Add" flex={1} onPress={onAdd} />
      </XStack>
    </AnimatedCard>
  );
};
