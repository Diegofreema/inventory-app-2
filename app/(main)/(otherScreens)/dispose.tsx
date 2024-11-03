/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { useWindowDimensions } from 'react-native';
import { Stack, View } from 'tamagui';
import { z } from 'zod';

import { Container } from '~/components/Container';
import { CustomController } from '~/components/form/CustomController';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { useDisposal } from '~/lib/tanstack/mutations';
import { disposeSchema } from '~/lib/validators';

const Dispose = (): JSX.Element => {
  const { name, productId, id } = useLocalSearchParams<{
    productId: string;
    name: string;
    id: string;
  }>();


  const { isPending, mutateAsync } = useDisposal();
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
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  const isBigTablet = width >= 700;
  const containerWidth = isBigTablet ? '60%' : isSmallTablet ? '80%' : '100%';
  const onSubmit = async (values: z.infer<typeof disposeSchema>) => {
    try {
      await mutateAsync({ qty: +values.qty, productId, id });
      reset();
      router.back();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Container>
      <View w={containerWidth} mx="auto">
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

            <MyButton
              title="Dispose"
              disabled={isPending}
              loading={isPending}
              height={60}
              marginTop={20}
              onPress={handleSubmit(onSubmit)}
            />
          </Stack>
        </CustomScroll>
      </View>
    </Container>
  );
};

export default Dispose;
