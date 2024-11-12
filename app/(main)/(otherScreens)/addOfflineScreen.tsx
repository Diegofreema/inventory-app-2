/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { Q } from '@nozbe/watermelondb';
import { createId } from '@paralleldrive/cuid2';
import { X } from '@tamagui/lucide-icons';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dimensions, FlatList, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import { toast } from "sonner-native";
import { Input, Stack, Text, View } from 'tamagui';
import { z } from 'zod';

import EnhancedCartButton from '~/components/CartButton';
import { Container } from '~/components/Container';
import { CustomController } from '~/components/form/CustomController';
import { MyCustomInput } from '~/components/form/CustomSelect2';
import { CustomPressable } from '~/components/ui/CustomPressable';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { FormLoader } from '~/components/ui/Loading';
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

const { height, width } = Dimensions.get('window');
export default function AddOfflineScreen() {
  const { error, mutateAsync, isPending } = useAddSales();
  const [customerProductId, setCustomerProductId] = useState('');
  const cameraRef = useRef<CameraView>(null);
  const [scanned, setScanned] = useState(false);
  const [scannedProductName, setScannedProductName] = useState('');
  const [query] = useState('');
  const { data } = useSalesRef();
  const router = useRouter();
  const { storedProduct } = useGet();
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { width } = useWindowDimensions();
  const [selected, setSelected] = useState<{ value: string; label: string } | null>(null);
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
      quantity: item?.qty,
    })) || [];
  const filteredData = useMemo(() => {
    if (!query) return formattedProducts;
    return formattedProducts.filter((f) => f.label.toLowerCase().includes(query.toLowerCase()));
  }, [query, formattedProducts]);
  const { productId } = watch();
  console.log({ productId });
  const memoizedPrice = useMemo(() => {
    if (!productId) return null;
    return storedProduct?.find((item) => item?.id === productId);
  }, [storedProduct, productId]);

  const onSubmit = async (value: z.infer<typeof addToCart>) => {
    if (!memoizedPrice) return;
    if (!productId)
      return toast.info( 'Please select a',{
        description: 'product to add to cart',
      });
    try {
      const product = await products?.find(value.productId);
      if (!product) Error('Product not found');
      setSelected(null);
      if (product && product?.qty < +value.qty) {
        return toast.info('Product out of stock',{
          description: `${product?.qty} items are available`,
        });
      }
      await mutateAsync({
        productId: memoizedPrice.productId,
        qty: +value.qty,
        name: product.product,
        cost: memoizedPrice.marketPrice,
      });
      if (!error) {
        reset();
      }
    } catch (error) {
      console.log(error, 'error');

      toast.error('Error',{
        description: (error as Error).message,
      });
    }
  };
  // useEffect(() => {
  //   if(customerProductId){
  //
  //   }
  // }, []);
  const onPress = useCallback(() => {
    router.push('/cart');
  }, []);
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);
  useEffect(() => {
    const fetchProduct = async () => {
      const product = await products
        .query(Q.where('customer_product_id', Q.eq(customerProductId)), Q.take(1))
        .fetch();
      if (product.length) {
        setValue('productId', product[0].id);
        setScannedProductName(product[0].product);
      } else {
        toast.info('Sorry',{
          description: 'Product not found',
        });
        setScanned(false);
      }
    };
    if (customerProductId) {
      fetchProduct();
    }
  }, [customerProductId]);
  if (!permission) return <FormLoader />;
  const onOpenCamera = () => {
    setShowCamera(true);
    setScanned(true);
  };
  const onBarcodeScanner = async ({ data }: BarcodeScanningResult) => {
    if (data) {
      setCustomerProductId(data);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setShowCamera(false);
    }
  };
  const handleChange = (value: string) => {
    setValue('productId', value);
    console.log({ value });
  };
  console.log(productId);
  const isMid = width < 768;
  const isSmall = width < 425;

  const finalWidth = isSmall ? '100%' : isMid ? '100%' : '80%';
  return showCamera ? (
    <CameraView
      style={styles.container}
      facing="back"
      ref={cameraRef}
      barcodeScannerSettings={{
        barcodeTypes: [
          'codabar',
          'aztec',
          'code128',
          'code39',
          'code93',
          'datamatrix',
          'upc_e',
          'upc_a',
          'pdf417',
          'itf14',
          'ean8',
          'ean13',
        ],
      }}
      onBarcodeScanned={onBarcodeScanner}>
      <Pressable
        onPress={() => {
          setShowCamera(false);
          setScanned(false);
        }}
        style={({ pressed }) => [styles.cancel, { opacity: pressed ? 0.5 : 1 }]}>
        <X color="white" size={50} />
      </Pressable>

      <View borderColor="white" borderWidth={7} height={300} width={300} />
    </CameraView>
  ) : (
    <Container>
      <NavHeader title="Add store sales" />
      <CustomScroll scroll={false}>
        <Stack gap={10} width={finalWidth} mx="auto">
          {scanned ? (
            <View flexDirection="row" alignItems="center">
              <Input
                placeholder="Product name"
                value={scannedProductName}
                onChangeText={setScannedProductName}
                backgroundColor="white"
                color="black"
                height={55}
                editable={false}
                flex={1}
                marginRight={4}
              />
              <X size={24} color={colors.black} onPress={() => setScanned(false)} />
            </View>
          ) : (
            <MyCustomInput
              data={filteredData}
              onValueChange={handleChange}
              setSelectedValue={setSelected}
              selectedValue={selected}
            />
          )}

          <CustomController
            name="qty"
            control={control}
            errors={errors}
            placeholder="Enter quantity"
            label="Enter quantity"
            type="number-pad"
          />
          <MyButton
            title="Add to cart"
            disabled={isPending}
            loading={isPending}
            height={60}
            marginTop={20}
            onPress={handleSubmit(onSubmit)}
          />
          <MyButton title="Scan product" height={60} marginTop={20} onPress={onOpenCamera} />

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
        </Stack>
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
        await item.update((ref) => {
          ref.isActive = true;
        });
        SecureStore.setItem('salesRef', item.saleReference);
        const items = await saleReferences.query(Q.where('id', Q.notEq(salesRef))).fetch();

        for (const i of items) {
          await i.update((ref) => {
            ref.isActive = false;
          });
        }
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
  const doneAttending = async () => {
    await database.write(async () => {
      const allRef = await saleReferences.query().fetch();
      for (const ref of allRef) {
        await ref.destroyPermanently();
      }
      queryClient.invalidateQueries({ queryKey: ['sales_ref'] });
    });
  };
  return (
    <FlatList
      data={data}
      horizontal
      ListHeaderComponent={() =>
        data.length > 1 ? null : (
          <CustomPressable onPress={doneAttending}>
            <View
              borderWidth={1}
              borderColor="red"
              backgroundColor="red"
              borderRadius={5}
              padding={5}
              alignItems="center">
              <Text fontSize={18} color={colors.white}>
                Done
              </Text>
            </View>
          </CustomPressable>
        )
      }
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

const styles = StyleSheet.create({
  snap: {
    marginTop: 'auto',
    marginBottom: 50,
    alignSelf: 'center',
    height: 70,
    width: 70,
    backgroundColor: 'white',
    zIndex: 1,
    borderRadius: 50,
  },
  abs: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  container: {
    flex: 1,
    height,
    zIndex: 10,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancel: { zIndex: 555555, position: 'absolute', top: 20, right: 10 },
});
