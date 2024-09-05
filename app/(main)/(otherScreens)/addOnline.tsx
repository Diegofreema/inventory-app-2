/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { Stack } from 'tamagui';
import { z } from 'zod';

import { Container } from '~/components/Container';
import { CustomController } from '~/components/form/CustomController';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { products } from '~/db';
import { useGet } from '~/hooks/useGet';
import { useAdd247 } from '~/lib/tanstack/mutations';
import { pharmacySales } from '~/lib/validators';

export default function AddOnlineScreen() {
  const { mutateAsync, isPending } = useAdd247();
  const { storedProduct } = useGet();

  const memoizedProductName = useMemo(() => {
    if (!storedProduct) return [];
    return storedProduct?.map((item) => ({
      value: item?.id,
      label: item?.product,
    }));
  }, [storedProduct]);
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
    watch,
  } = useForm<z.infer<typeof pharmacySales>>({
    defaultValues: {
      qty: '',
      productName: '',
    },
    resolver: zodResolver(pharmacySales),
  });
  const { productName } = watch();
  console.log({ productName });

  const onSubmit = async (value: z.infer<typeof pharmacySales>) => {
    console.log(value.productName);

    try {
      const productInDb = await products.find(value.productName);
      console.log(productInDb?.product, 'dfj');

      if (!productInDb) return;
      if (productInDb.qty < +value.qty) {
        return Toast.show({
          text1: 'Product is out of stock',
          text2: `${productInDb.qty} product left in stock, restock first`,
        });
      }

      await mutateAsync({
        productId: value.productName,
        qty: +value.qty,
        unitPrice: productInDb?.sellingPrice!,
      });
      reset();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container>
      <NavHeader title="Add 247pharmacy sale" />
      <Stack gap={10}>
        <CustomController
          name="productName"
          control={control}
          errors={errors}
          placeholder="Product Name"
          label="Product Name"
          variant="select"
          data={memoizedProductName}
          setValue={setValue}
        />
        <CustomController
          name="qty"
          control={control}
          errors={errors}
          placeholder="Enter quantity"
          label="Enter quantity"
        />
      </Stack>

      <MyButton
        title="Submit"
        disabled={isPending}
        loading={isPending}
        height={60}
        marginTop={20}
        onPress={handleSubmit(onSubmit)}
      />
    </Container>
  );
}
