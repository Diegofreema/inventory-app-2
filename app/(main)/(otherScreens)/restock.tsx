/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
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
  const { isPending, mutateAsync } = useSupply();
  const { name, price, productId, id } = useLocalSearchParams<{
    productId: string;
    name: string;
    price: string;
    id: string;
  }>();
  const router = useRouter();
  console.log(name, price, productId, id);

  const { data, isPending: isLoading, isError, refetch } = useInfo();
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
  const info = data?.[0];
  const onSubmit = async (value: z.infer<typeof productSupplySchema>) => {
    if (!info?.shareNetpro || !info?.sharePrice || !info?.shareSeller) return;

    try {
      await mutateAsync({
        dealerShare: info?.shareSeller!,
        netProShare: info?.shareNetpro!,
        sellingPrice: info?.sharePrice!,
        newPrice: value.newPrice,
        productId,
        qty: +value.qty,
        unitCost: value.unitPrice,
        id,
      });
      reset();
      router.back();
    } catch (error: any) {
      Toast.show({
        text1: 'Something went wrong',
        text2: error.message,
      });
    }
  };

  return (
    <Container paddingHorizontal={isLoading ? 0 : '$4'}>
      <View paddingHorizontal={isLoading ? '$4' : 0}>
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
              marginTop={20}
              onPress={handleSubmit(onSubmit)}
            />
          </Stack>
        </CustomScroll>
      )}
    </Container>
  );
};

export default Restock;
