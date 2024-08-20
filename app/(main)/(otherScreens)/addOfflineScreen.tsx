/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Stack } from 'tamagui';
import { z } from 'zod';

import { Container } from '~/components/Container';
import { CustomController } from '~/components/form/CustomController';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { paymentType } from '~/data';
import { useAddSales } from '~/lib/tanstack/mutations';
import { storeSales } from '~/lib/validators';

export default function AddOfflineScreen() {
  const { data, mutateAsync, isPending } = useAddSales();
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof storeSales>>({
    defaultValues: {
      qty: '',
      productName: '',
      paymentType: '',
      salesReference: '',
    },
    resolver: zodResolver(storeSales),
  });

  const onSubmit = async (value: z.infer<typeof storeSales>) => {
    // ! to add local database query
    await mutateAsync({
      productId: '',
      qty: value.qty,
      salesReference: '',
      paymentType: 'Card',
      salesRepId: '',
      transactionInfo: '',
    });
    if (data?.result === 'done') {
      reset();
    }
  };
  return (
    <Container>
      <NavHeader title="Add store sales" />
      <CustomScroll>
        <Stack gap={10}>
          <CustomController
            name="productName"
            control={control}
            errors={errors}
            placeholder="Product Name"
            label="Product Name"
          />
          <CustomController
            name="qty"
            control={control}
            errors={errors}
            placeholder="Enter quantity"
            label="Enter quantity"
          />
          <CustomController
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
          />
        </Stack>

        <MyButton
          title="Add to cart"
          disabled={isPending}
          loading={isPending}
          height={60}
          mt={20}
          onPress={handleSubmit(onSubmit)}
        />
      </CustomScroll>
    </Container>
  );
}
