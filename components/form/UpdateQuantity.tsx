import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner-native';
import { Stack, View } from 'tamagui';
import { z } from 'zod';

import { CustomController } from '~/components/form/CustomController';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { colors } from '~/constants';
import { useUpdateQty } from '~/lib/tanstack/mutations';
import { updateQtySchema } from '~/lib/validators';

export const UpdateQuantityForm = () => {
  const { name, id } = useLocalSearchParams<{ name: string; id: string }>();
  const { mutateAsync } = useUpdateQty();
  const queryClient = useQueryClient();
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
      await queryClient.invalidateQueries({ queryKey: ['product'] });
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
          placeholder="Quantity"
          control={control}
          errors={errors}
          label="Update quantity"
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
