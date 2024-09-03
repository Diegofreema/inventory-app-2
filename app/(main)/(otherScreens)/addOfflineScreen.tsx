/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { Q } from '@nozbe/watermelondb';
import { createId } from '@paralleldrive/cuid2';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList } from 'react-native';
import Toast from 'react-native-toast-message';
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
import database, { products, saleReferences } from '~/db';
import SaleReference from '~/db/model/SalesReference';
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
  const { storedProduct } = useGet();
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
    storedProduct?.map((item) => ({
      value: item?.productId,
      label: item?.product,
    })) || [];
  const { productId } = watch();
  const memoizedPrice = useMemo(() => {
    if (!productId) return null;
    return storedProduct?.find((item) => item?.productId === productId)?.sellingPrice;
  }, [storedProduct, productId]);

  const cartLength = cartData?.length || 0;
  const onSubmit = async (value: z.infer<typeof addToCart>) => {
    if (!memoizedPrice) return;
    const product = await products?.find(value.productId);

    if (product && product?.qty < +value.qty) {
      return Toast.show({
        text1: 'Product out of stock',
        text2: `Only ${product?.qty} items are available`,
      });
    }
    await mutateAsync({
      productId: value.productId,
      qty: +value.qty,
      cartId: 0,
      cost: memoizedPrice,
    });
    if (!error) {
      reset();
    }
  };
  const onPress = useCallback(() => {
    router.push('/cart');
  }, []);

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
          marginTop={20}
          onPress={handleSubmit(onSubmit)}
        />

        <View marginTop={20}>
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

const SalesRefFlatList = ({ data }: { data: SaleReference[] }) => {
  const queryClient = useQueryClient();
  const onPress = async (salesRef: string) => {
    SecureStore.setItem('salesRef', salesRef);
    await database.write(async () => {
      const item = await saleReferences.find(salesRef);
      item.update((ref) => {
        ref.isActive = true;
      });

      const items = await saleReferences
        .query(Q.where('salesReference', Q.notEq(salesRef)))
        .fetch();

      items.forEach(async (i) => {
        i.update((ref) => {
          ref.isActive = false;
        });
      });
    });

    queryClient.invalidateQueries({ queryKey: ['sales_ref'] });
  };
  const onNewCustomer = async () => {
    await database.write(async () => {
      const activeCustomer = await saleReferences.query(Q.where('isActive', Q.eq(true))).fetch();
      if (activeCustomer.length) {
        await activeCustomer[0].update((ref) => {
          ref.isActive = false;
        });
      }

      const newCustomerRef = await saleReferences.create((ref) => {
        ref.saleReference = createId() + Math.random().toString(36).slice(2);
        ref.isActive = true;
      });
      SecureStore.setItem('salesRef', newCustomerRef.saleReference);
    });

    queryClient.invalidateQueries({ queryKey: ['sales_ref'] });
  };
  return (
    <FlatList
      data={data}
      horizontal
      renderItem={({ item, index }) => (
        <CustomPressable onPress={() => onPress(item.saleReference)}>
          <View
            backgroundColor={item.isActive ? colors.green : '$backgroundTransparent'}
            padding={5}
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
              padding={5}
              alignItems="center">
              <Text fontSize={18}>New Customer</Text>
            </View>
          </CustomPressable>
        )
      }
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
    />
  );
};
