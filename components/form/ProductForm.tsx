/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from '@tamagui/lucide-icons';
import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dimensions, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Toast from 'react-native-toast-message';
import { Stack, View } from 'tamagui';
import { z } from 'zod';

import { CustomController } from './CustomController';
import { newProductSchema } from '../../lib/validators';
import { Error } from '../ui/Error';
import { FormLoader } from '../ui/Loading';
import { MyButton } from '../ui/MyButton';
import { NavHeader } from '../ui/NavHeader';

import { colors } from '~/constants';
import { online } from '~/data';
import { useAddNewProduct } from '~/lib/tanstack/mutations';
import { useCat, useInfo } from '~/lib/tanstack/queries';
import { Cats } from '~/type';
const { height, width } = Dimensions.get('window');
export const ProductForm = (): JSX.Element => {
  const { isPending, mutateAsync } = useAddNewProduct();
  const { data: info, isPending: infoPending, isError, refetch } = useInfo();
  const { height, width } = useWindowDimensions();
  const cameraRef = useRef<CameraView>(null);

  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { data: cat, isPending: catPending, isError: isErrorCat, refetch: refetchCat } = useCat();
  const handleRefetch = useCallback(() => {
    refetch();
    refetchCat();
  }, [refetch, refetchCat]);

  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [subCategories, setSubCategories] = useState<{ value: string; label: string }[]>([]);
  const {
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue,
  } = useForm<z.infer<typeof newProductSchema>>({
    defaultValues: {
      category: '',
      customerproductid: '',
      des: '',
      marketprice: '',
      online: true,
      product: '',
      qty: '',
      sellingprice: '',
      sharedealer: info?.shareseller,
      sharenetpro: info?.sharenetpro,
      state: info?.statename,
      subcategory: '',
    },

    resolver: zodResolver(newProductSchema),
  });

  const { category } = watch();
  useEffect(() => {
    if (!cat) return;
    const formattedData: Cats[] = Object.values(
      cat?.reduce((acc: any, curr) => {
        if (!acc[curr?.category]) {
          acc[curr?.category] = {
            category: curr?.category,
            subcategories: [],
          };
        }
        acc[curr?.category].subcategories.push(curr?.subcategory);

        return acc;
      }, {})
    );
    const cats = formattedData?.map(({ category }) => ({
      value: category,
      label: category,
    }));

    const subCats = formattedData.find(
      (c) => c.category.toLowerCase() === category.toLowerCase()
    )?.subcategories;
    const formattedArray =
      subCats?.map((c) => ({
        value: c,
        label: c,
      })) ?? [];

    setCategories(cats ?? []);
    setSubCategories(formattedArray);
  }, [cat, category]);
  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, []);
  if (!permission) return <FormLoader />;
  if (isError || isErrorCat) {
    return <Error onRetry={handleRefetch} />;
  }

  if (infoPending || catPending) return <FormLoader />;
  const onSubmit = (values: z.infer<typeof newProductSchema>) => {
    console.log({ values });
    try {
      mutateAsync({
        ...values,
        sharedealer: info?.shareseller,
        sharenetpro: info?.sharenetpro,
        state: info?.statename,
        online: values.online,
      });

      reset();
    } catch (error: any) {
      Toast.show({
        text1: 'Failed',
        text2: error?.message,
      });
    }
  };

  const onOpenCamera = () => {
    setShowCamera(true);
  };

  const onBarcodeScanner = async ({
    data,
    type,
    bounds,
    cornerPoints,
    raw,
  }: BarcodeScanningResult) => {
    console.log({ data, type, bounds, cornerPoints, raw });

    // if (!scanning) return;
    if (data) {
      console.log(data);
      // Haptics.selectionAsync();
      setValue('customerproductid', data);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setShowCamera(false);
    }
  };

  return !showCamera ? (
    <View gap={10} paddingHorizontal="$4">
      <NavHeader title="Add A New Product" />
      <Stack gap={10} paddingBottom={30}>
        <CustomController
          name="product"
          placeholder="Product Name"
          control={control}
          errors={errors}
          label="Product Name"
        />
        <CustomController
          name="sellingprice"
          placeholder="Selling Price"
          control={control}
          errors={errors}
          label="Selling price"
          type="numeric"
        />

        <CustomController
          name="marketprice"
          placeholder="Market price"
          control={control}
          errors={errors}
          label="Market price"
          type="numeric"
        />
        <CustomController
          name="qty"
          placeholder="Quantity"
          control={control}
          errors={errors}
          label="Quantity"
          type="numeric"
        />

        <CustomController
          name="des"
          placeholder="Description"
          control={control}
          errors={errors}
          label="Description"
          variant="textarea"
        />
        <CustomController
          name="category"
          placeholder="Category"
          control={control}
          errors={errors}
          label="Category"
          variant="select"
          data={categories}
          setValue={setValue}
        />
        <CustomController
          name="subcategory"
          placeholder="Subcategories"
          control={control}
          errors={errors}
          label="Subcategories"
          variant="select"
          data={subCategories}
          setValue={setValue}
        />
        <CustomController
          name="online"
          placeholder="Online"
          control={control}
          errors={errors}
          label="Online"
          variant="select"
          data={online}
          setValue={setValue}
        />
        <MyButton
          title="Scan barcode"
          marginTop={20}
          onPress={onOpenCamera}
          backgroundColor={colors.black}
          height={55}
          borderRadius={5}
          pressStyle={{
            opacity: 0.5,
          }}
        />

        <MyButton
          title="Submit"
          marginTop={20}
          disabled={isPending}
          loading={isPending}
          onPress={handleSubmit(onSubmit)}
          backgroundColor={colors.green}
          height={55}
          borderRadius={5}
          pressStyle={{
            opacity: 0.5,
          }}
        />
      </Stack>
    </View>
  ) : (
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
        onPress={() => setShowCamera(false)}
        style={({ pressed }) => [styles.cancel, { opacity: pressed ? 0.5 : 1 }]}>
        <X color="white" size={50} />
      </Pressable>

      <View
        position="absolute"
        borderColor="white"
        borderWidth={7}
        height={300}
        width={300}
        top={height * 0.3}
        left={width * 0.08}
      />
    </CameraView>
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
  },
  cancel: { zIndex: 555555, position: 'absolute', top: 50, right: 20 },
});
