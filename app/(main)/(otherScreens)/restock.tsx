/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Stack, View } from 'tamagui';
import { z } from 'zod';

import { Container } from '~/components/Container';
import { CustomController } from '~/components/form/CustomController';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { Error } from '~/components/ui/Error';
import { FormLoader } from '~/components/ui/Loading';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { useSupply } from '~/lib/tanstack/mutations';
import { useInfo } from '~/lib/tanstack/queries';
import { productSupplySchema } from '~/lib/validators';

const Restock = (): JSX.Element => {
  const { isPending, mutateAsync, error } = useSupply();
  const { name, price, productId } = useLocalSearchParams<{
    productId: string;
    name: string;
    price: string;
  }>();
  const router = useRouter();
  console.log({ productId, name, price });

  const { data: info, isPending: isLoading, isError, refetch } = useInfo();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof productSupplySchema>>({
    defaultValues: {
      newPrice: price,
      product: name,
      qty: '',
      unitPrice: '',
    },
    resolver: zodResolver(productSupplySchema),
  });
  if (isError) return <Error onRetry={refetch} />;

  const onSubmit = async (value: z.infer<typeof productSupplySchema>) => {
    if (!info?.sharenetpro || !info?.shareprice || !info?.shareseller) return;

    try {
      await mutateAsync({
        dealerShare: info?.shareseller!,
        netProShare: info?.sharenetpro!,
        sellingPrice: info?.shareprice!,
        newPrice: value.newPrice,
        productId,
        qty: value.qty,
        unitCost: value.unitPrice,
      });
    } catch (error) {
      console.log(error);
    }
    if (error) {
      console.log('🚀 ~ onSubmit ~ error:', error);
    }
    if (!error) {
      console.log('done');

      reset();
      router.back();
    }
  };

  return (
    <Container px={isLoading ? 0 : '$4'}>
      <View px={isLoading ? '$4' : 0}>
        <NavHeader title="Product Supply" />
      </View>
      {isLoading ? (
        <FormLoader />
      ) : (
        <CustomScroll>
          <Stack gap={10}>
            <CustomController
              name="product"
              control={control}
              errors={errors}
              placeholder="Product Name"
              label="Product Name"
              editable={false}
            />
            <CustomController
              name="unitPrice"
              control={control}
              errors={errors}
              placeholder="Unit Price"
              label="Unit Price (NGN)"
            />
            <CustomController
              name="newPrice"
              control={control}
              errors={errors}
              placeholder="New Price"
              label="New Price (NGN)"
            />
            <CustomController
              name="qty"
              control={control}
              errors={errors}
              placeholder="Quantity"
              label="Quantity"
            />

            <MyButton
              title="Add Supply"
              disabled={isPending}
              loading={isPending}
              height={60}
              mt={20}
              onPress={handleSubmit(onSubmit)}
            />
          </Stack>
        </CustomScroll>
      )}
    </Container>
  );
};

export default Restock;
