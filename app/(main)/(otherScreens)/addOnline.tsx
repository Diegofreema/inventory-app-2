/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
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
import { useShowToast } from '~/lib/zustand/useShowToast';

export default function AddOnlineScreen() {
  const { mutateAsync, isPending } = useAdd247();
  const { storedProduct } = useGet();
  const toast = useShowToast((state) => state.onShow);
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
  } = useForm<z.infer<typeof pharmacySales>>({
    defaultValues: {
      qty: '',
      productName: '',
    },
    resolver: zodResolver(pharmacySales),
  });

  const onSubmit = async (value: z.infer<typeof pharmacySales>) => {
    try {
      const productInDb = await products.find(value.productName);

      if (!productInDb) return;
      if (productInDb.qty < +value.qty) {
        return toast({
          message: 'Product is out of stock',
          description: `${productInDb.qty} product left in stock, restock first`,
          type: 'info',
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
