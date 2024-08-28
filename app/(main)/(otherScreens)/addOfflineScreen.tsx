/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Stack } from 'tamagui';
import { z } from 'zod';

import { CartButton } from '~/components/CartButton';
import { Container } from '~/components/Container';
import { CustomController } from '~/components/form/CustomController';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { useGet } from '~/hooks/useGet';
// import { paymentType } from '~/data';
import { useAddSales } from '~/lib/tanstack/mutations';
import { useCart } from '~/lib/tanstack/queries';
import { addToCart } from '~/lib/validators';

export default function AddOfflineScreen() {
  const { error, mutateAsync, isPending } = useAddSales();
  const { data: cartData } = useCart();
  console.log(cartData);

  const { products } = useGet();
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
    setValue,
  } = useForm<z.infer<typeof addToCart>>({
    defaultValues: {
      qty: '',
      productId: '',
    },
    resolver: zodResolver(addToCart),
  });
  const formattedProducts =
    products?.map((item) => ({
      value: item?.productId,
      label: item?.product,
    })) || [];
  const cartLength = cartData?.cartItem.length || 0;
  const onSubmit = async (value: z.infer<typeof addToCart>) => {
    if (!cartData?.id) return;
    await mutateAsync({
      productId: value.productId,
      qty: +value.qty,
      cartId: cartData?.id,
      cost: value.unitCost,
    });
    if (!error) {
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
            variant="select"
            data={formattedProducts}
            setValue={setValue}
          />
          <CustomController
            name="qty"
            control={control}
            errors={errors}
            placeholder="Enter quantity"
            label="Enter quantity"
          />
          <CustomController
            name="unitCost"
            control={control}
            errors={errors}
            placeholder="Enter unit cost"
            label="Enter unit cost"
          />
          {/* <CustomController
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
          /> */}
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
      <CartButton qty={cartLength} />
    </Container>
  );
}
