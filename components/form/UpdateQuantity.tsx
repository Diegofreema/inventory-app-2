import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';

import { Stack, View } from 'tamagui';
import { z } from 'zod';

import { CustomController } from '~/components/form/CustomController';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { colors } from '~/constants';
import { useUpdateQty } from '~/lib/tanstack/mutations';
import { updateQtySchema } from '~/lib/validators';
import { toast } from 'sonner-native';

export const UpdateQuantityForm = () => {
  const { name, id } = useLocalSearchParams<{ name: string; id: string }>();
  const { mutateAsync } = useUpdateQty();
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<z.infer<typeof updateQtySchema>>({
    defaultValues: {
      qty: '',
    },
    resolver: zodResolver(updateQtySchema),
  });

  const onSubmit = async (values: z.infer<typeof updateQtySchema>) => {
    try {
      await mutateAsync({ qty: +values.qty, id });
      reset();
      router.back();
    } catch (e: any) {
      console.log(e);
      toast.error('Error', {
        description: e.message,
      });
    }
  };
  return (
    <View gap={10} paddingHorizontal="$4">
      <NavHeader title={name!} />
      <Stack gap={10}>
        <CustomController
          name="qty"
          placeholder="Qty"
          control={control}
          errors={errors}
          label="Update qty"
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
