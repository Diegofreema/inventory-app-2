/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { Q } from '@nozbe/watermelondb';
import { createId } from '@paralleldrive/cuid2';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList } from 'react-native';
import Toast from 'react-native-toast-message';
import { Stack, Text, View } from 'tamagui';
import { z } from 'zod';

import EnhancedCartButton from '~/components/CartButton';
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
import { useSalesRef } from '~/lib/tanstack/queries';
import { addToCart } from '~/lib/validators';

export default function AddOfflineScreen() {
  const { error, mutateAsync, isPending } = useAddSales();
  const [query, setQuery] = useState('');
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
      value: item?.id,
      label: item?.product,
    })) || [];
  const filteredData = useMemo(() => {
    if (!query) return formattedProducts;
    return formattedProducts.filter((f) => f.label.toLowerCase().includes(query.toLowerCase()));
  }, [query, formattedProducts]);
  const { productId } = watch();
  const memoizedPrice = useMemo(() => {
    if (!productId) return null;
    return storedProduct?.find((item) => item?.id === productId)?.sellingPrice;
  }, [storedProduct, productId]);

  const onSubmit = async (value: z.infer<typeof addToCart>) => {
    if (!memoizedPrice) return;
    try {
      const product = await products?.find(value.productId);

      if (product && product?.qty < +value.qty) {
        return Toast.show({
          text1: 'Product out of stock',
          text2: `${product?.qty} items are available`,
        });
      }
      await mutateAsync({
        productId: value.productId,
        qty: +value.qty,
        name: product.product,
        cost: memoizedPrice,
      });
      if (!error) {
        reset();
      }
    } catch (error) {
      Toast.show({
        text1: 'Error',
        text2: (error as Error).message,
      });
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
            data={filteredData}
            setValue={setValue}
            query={query}
            setQuery={setQuery}
            autoFocus
          />
          <CustomController
            name="qty"
            control={control}
            errors={errors}
            placeholder="Enter quantity"
            label="Enter quantity"
            type="number-pad"
          />
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
              fontSize={2}
            />
          )}
        </View>
      </CustomScroll>
      <EnhancedCartButton onPress={onPress} />
    </Container>
  );
}

const SalesRefFlatList = ({ data }: { data: SaleReference[] }) => {
  const queryClient = useQueryClient();

  const onPress = async (salesRef: string) => {
    try {
      await database.write(async () => {
        const item = await saleReferences.find(salesRef);
        item.update((ref) => {
          ref.isActive = true;
        });
        SecureStore.setItem('salesRef', item.saleReference);
        const items = await saleReferences.query(Q.where('id', Q.notEq(salesRef))).fetch();

        items.forEach(async (i) => {
          i.update((ref) => {
            ref.isActive = false;
          });
        });
      });

      queryClient.invalidateQueries({ queryKey: ['sales_ref'] });
    } catch (error) {
      console.log((error as Error).message);
    }
  };
  const onNewCustomer = async () => {
    try {
      await database.write(async () => {
        const activeCustomer = await saleReferences
          .query(Q.where('is_active', Q.eq(true)), Q.take(1))
          .fetch();
        if (activeCustomer.length) {
          await activeCustomer[0].update((ref) => {
            ref.isActive = false;
          });
        }

        const newCustomerRef = await saleReferences.create((ref) => {
          ref.saleReference = format(Date.now(), 'dd/MM/yyyy HH:mm') + createId();
          ref.isActive = true;
        });
        SecureStore.setItem('salesRef', newCustomerRef.saleReference);
      });

      queryClient.invalidateQueries({ queryKey: ['sales_ref'] });
    } catch (error) {
      console.log((error as Error).message);
    }
  };
  return (
    <FlatList
      data={data}
      horizontal
      renderItem={({ item, index }) => (
        <CustomPressable onPress={() => onPress(item.id)}>
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
