/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Stack } from 'tamagui';
import { z } from 'zod';

import { Container } from '~/components/Container';
import { CustomController } from '~/components/form/CustomController';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { useAdd247 } from '~/lib/tanstack/mutations';
import { pharmacySales } from '~/lib/validators';

export default function AddOnlineScreen() {
  const { data, mutateAsync, isPending } = useAdd247();
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<z.infer<typeof pharmacySales>>({
    defaultValues: {
      qty: '',
      productName: '',
    },
    resolver: zodResolver(pharmacySales),
  });

  const onSubmit = async (value: z.infer<typeof pharmacySales>) => {
    // ! to add local database query
    await mutateAsync({ productId: '', qty: value.qty });
    if (data?.result === 'done') {
      reset();
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
