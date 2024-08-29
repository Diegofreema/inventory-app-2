/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { eq, ne } from 'drizzle-orm';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList } from 'react-native';
import { Stack, Text, View } from 'tamagui';
import { z } from 'zod';

import { CartButton } from '~/components/CartButton';
import { Container } from '~/components/Container';
import { CustomController } from '~/components/form/CustomController';
import { CustomPressable } from '~/components/ui/CustomPressable';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { CustomSubHeading } from '~/components/ui/typography';
import { colors } from '~/constants';
import { SalesRefSelect } from '~/db/schema';
import { useDrizzle } from '~/hooks/useDrizzle';
import { useGet } from '~/hooks/useGet';
// import { paymentType } from '~/data';
import { useAddSales } from '~/lib/tanstack/mutations';
import { useCart, useSalesRef } from '~/lib/tanstack/queries';
import { addToCart } from '~/lib/validators';

export default function AddOfflineScreen() {
  const { error, mutateAsync, isPending } = useAddSales();
  const { data: cartData } = useCart();
  const { data } = useSalesRef();
  const router = useRouter();
  const { products } = useGet();
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
    watch,
  } = useForm<z.infer<typeof addToCart>>({
    defaultValues: {
      qty: '',
      productId: '',
    },
    resolver: zodResolver(addToCart),
  });
  const formattedProducts =
    products?.map((item) => ({
      value: item?.productId,
      label: item?.product,
    })) || [];
  const { productId } = watch();
  const memoizedPrice = useMemo(() => {
    if (!productId) return null;
    return products?.find((item) => item?.productId === productId)?.sellingprice;
  }, [products, productId]);

  console.log(memoizedPrice, 'price', productId);

  const cartLength = cartData?.cartItem.length || 0;
  const onSubmit = async (value: z.infer<typeof addToCart>) => {
    if (!cartData?.id || !memoizedPrice) return;

    await mutateAsync({
      productId: value.productId,
      qty: +value.qty,
      cartId: cartData?.id,
      cost: memoizedPrice,
    });
    if (!error) {
      reset();
    }
  };
  const onPress = useCallback(() => {
    router.push('/cart');
  }, []);
  console.log(error, 'error');

  return (
    <Container>
      <NavHeader title="Add store sales" />
      <CustomScroll>
        <Stack gap={10}>
          <CustomController
            name="productId"
            control={control}
            errors={errors}
            placeholder="Product Name"
            label="Product Name"
            variant="select"
            data={formattedProducts}
            setValue={setValue}
          />
          <CustomController
            name="qty"
            control={control}
            errors={errors}
            placeholder="Enter quantity"
            label="Enter quantity"
            type="number-pad"
          />

          {/* <CustomController
            name="paymentType"
            control={control}
            errors={errors}
            placeholder="Select payment type"
            label="Select payment type"
            variant="select"
            data={paymentType}
          />
          <CustomController
            name="salesReference"
            control={control}
            errors={errors}
            placeholder="Enter sale's reference number"
            label="Enter sale's reference number"
          /> */}
        </Stack>

        <MyButton
          title="Add to cart"
          disabled={isPending}
          loading={isPending}
          height={60}
          mt={20}
          onPress={handleSubmit(onSubmit)}
        />

        <View mt={20}>
          {data?.length ? (
            <SalesRefFlatList data={data} />
          ) : (
            <CustomSubHeading
              text="Not attending to a customer"
              color={colors.black}
              fontSize={18}
            />
          )}
        </View>
      </CustomScroll>
      <CartButton qty={cartLength} onPress={onPress} />
    </Container>
  );
}

const SalesRefFlatList = ({ data }: { data: SalesRefSelect[] }) => {
  const { db, schema } = useDrizzle();
  const queryClient = useQueryClient();
  const onPress = async (salesRef: string) => {
    SecureStore.setItem('salesRef', salesRef);
    await db
      .update(schema.salesreference)
      .set({ isActive: false })
      .where(ne(schema.salesreference.salesReference, salesRef));
    await db
      .update(schema.salesreference)
      .set({ isActive: true })
      .where(eq(schema.salesreference.salesReference, salesRef));

    queryClient.invalidateQueries({ queryKey: ['sales_ref'] });
  };
  const onNewCustomer = async () => {
    const activeCustomer = await db.query.salesreference.findFirst({
      where: eq(schema.salesreference.isActive, true),
    });

    if (activeCustomer) {
      await db
        .update(schema.salesreference)
        .set({ isActive: false })
        .where(eq(schema.salesreference.salesReference, activeCustomer.salesReference));
    }
    const newCustomerRef = await db
      .insert(schema.salesreference)
      .values({})
      .returning({ salesReference: schema.salesreference.salesReference });
    SecureStore.setItem('salesRef', newCustomerRef[0].salesReference);
    queryClient.invalidateQueries({ queryKey: ['sales_ref'] });
  };
  return (
    <FlatList
      data={data}
      horizontal
      renderItem={({ item, index }) => (
        <CustomPressable onPress={() => onPress(item.salesReference)}>
          <View
            bg={item.isActive ? colors.green : '$backgroundTransparent'}
            p={5}
            borderRadius={5}
            borderWidth={1}
            borderColor={item?.isActive ? colors.green : colors.black}
            maxWidth={120}
            justifyContent="center"
            alignItems="center">
            <Text color={item.isActive ? colors.white : colors.black} fontSize={18}>
              Customer {index + 1}
            </Text>
          </View>
        </CustomPressable>
      )}
      ListFooterComponent={() =>
        data.length > 1 ? null : (
          <CustomPressable onPress={onNewCustomer}>
            <View
              borderWidth={1}
              borderColor={colors.black}
              borderRadius={5}
              p={5}
              alignItems="center">
              <Text>New Customer</Text>
            </View>
          </CustomPressable>
        )
      }
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
    />
  );
};
