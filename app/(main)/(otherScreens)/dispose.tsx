/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Stack } from 'tamagui';
import { z } from 'zod';

import { Container } from '~/components/Container';
import { CustomController } from '~/components/form/CustomController';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { useDisposal } from '~/lib/tanstack/mutations';
import { disposeSchema } from '~/lib/validators';

const Dispose = (): JSX.Element => {
  const { name, productId } = useLocalSearchParams<{ productId: string; name: string }>();
  const { isPending, error, mutateAsync } = useDisposal();
  const router = useRouter();
  const {
    formState: { errors },
    handleSubmit,
    control,
    reset,
  } = useForm<z.infer<typeof disposeSchema>>({
    defaultValues: {
      productName: name,
      qty: '',
    },
    resolver: zodResolver(disposeSchema),
  });

  const onSubmit = async (values: z.infer<typeof disposeSchema>) => {
    await mutateAsync({ qty: values.qty, productId, unitCost: values.unitCost });
    if (!error) {
      reset();
      router.back();
    }
  };
  return (
    <Container>
      <NavHeader title="Dispose product" />
      <CustomScroll>
        <Stack gap={10}>
          <CustomController
            control={control}
            errors={errors}
            name="productName"
            label="Product Name"
            placeholder="Product Name"
            editable={false}
          />
          <CustomController
            control={control}
            errors={errors}
            name="qty"
            label="Quantity"
            placeholder="Quantity"
          />
          <CustomController
            control={control}
            errors={errors}
            name="unitCost"
            label="Unit cost"
            placeholder="Unit cost"
          />
          <MyButton
            title="Dispose"
            disabled={isPending}
            loading={isPending}
            height={60}
            mt={20}
            onPress={handleSubmit(onSubmit)}
          />
        </Stack>
      </CustomScroll>
    </Container>
  );
};

export default Dispose;
