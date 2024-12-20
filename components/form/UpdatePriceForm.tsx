import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';

import { Stack, View } from 'tamagui';
import { z } from 'zod';

import { CustomController } from '~/components/form/CustomController';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { colors } from '~/constants';
import { useUpdatePrice } from '~/lib/tanstack/mutations';
import { updateProduct } from '~/lib/validators';
import { useShowToast } from '~/lib/zustand/useShowToast';

export const UpdatePriceForm = () => {
  const { name, id } = useLocalSearchParams<{ name: string; id: string }>();
  const { mutateAsync } = useUpdatePrice();
  const toast = useShowToast((state) => state.onShow);
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<z.infer<typeof updateProduct>>({
    defaultValues: {
      price: '',
    },
    resolver: zodResolver(updateProduct),
  });

  const onSubmit = async (values: z.infer<typeof updateProduct>) => {
    try {
      await mutateAsync({ price: +values.price, id });
      reset();
      router.back();
    } catch (e: any) {
      console.log(e);
      toast({ message: 'Error', description: e.message, type: 'error' });
    }
  };
  return (
    <View gap={10} paddingHorizontal="$4">
      <NavHeader title={name!} />
      <Stack gap={10}>
        <CustomController
          name="price"
          placeholder="Price"
          control={control}
          errors={errors}
          label="Update price"
        />
        <MyButton
          title="Submit"
          marginTop={20}
          disabled={isSubmitting}
          loading={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          backgroundColor={colors.green}
          height={55}
          borderRadius={5}
          pressStyle={{
            opacity: 0.5,
          }}
        />
      </Stack>
    </View>
  );
};
