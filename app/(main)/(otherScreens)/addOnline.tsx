/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { eq } from 'drizzle-orm';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Stack } from 'tamagui';
import { z } from 'zod';

import { Container } from '~/components/Container';
import { CustomController } from '~/components/form/CustomController';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { useDrizzle } from '~/hooks/useDrizzle';
import { useGet } from '~/hooks/useGet';
import { useAdd247 } from '~/lib/tanstack/mutations';
import { pharmacySales } from '~/lib/validators';

export default function AddOnlineScreen() {
  const { mutateAsync, isPending, error } = useAdd247();
  const { products } = useGet();
  const { db, schema } = useDrizzle();
  const memoizedProductName = useMemo(() => {
    if (!products) return [];
    return products?.map((item) => ({
      value: item?.productId,
      label: item?.product,
    }));
  }, [products]);
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
      const productInDb = await db.query.product.findFirst({
        where: eq(schema.product.productId, value.productName),
        columns: {
          sellingprice: true,
        },
      });
      if (!productInDb) return;
      await mutateAsync({
        productId: value.productName,
        qty: value.qty,
        unitPrice: productInDb?.sellingprice!,
      });
      if (!error) {
        reset();
      }
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
        mt={20}
        onPress={handleSubmit(onSubmit)}
      />
    </Container>
  );
}
