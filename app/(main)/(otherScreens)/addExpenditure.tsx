/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useWindowDimensions } from 'react-native';
import { Stack, View } from 'tamagui';
import { z } from 'zod';

import { Container } from '~/components/Container';
import { CustomController } from '~/components/form/CustomController';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { colors } from '~/constants';
import { useAddAccount } from '~/lib/tanstack/mutations';
import { expenditureSchema } from '~/lib/validators';
import { router } from "expo-router";

export default function AddExpenditure() {
  const { mutateAsync, isPending, error } = useAddAccount();
  console.log(error);
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  const isBigTablet = width >= 700;
  const containerWidth = isBigTablet ? '60%' : isSmallTablet ? '80%' : '100%';
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof expenditureSchema>>({
    defaultValues: {
      accountName: '',
    },

    resolver: zodResolver(expenditureSchema),
  });

  const onSubmit = async (values: z.infer<typeof expenditureSchema>) => {
    await mutateAsync({
      name: values.accountName.charAt(0)?.toUpperCase() + values.accountName.slice(1),
    });
    console.log(error);

    if (!error) {
      router.back()
      reset();
    }
  };
  return (
    <Container>
      <CustomScroll>
        <View width={containerWidth} mx="auto">
          <NavHeader title="Add Expenditure" />
          <Stack gap={10}>
            <CustomController
              name="accountName"
              placeholder="Account Name"
              control={control}
              errors={errors}
              label="Account name"
            />
            <MyButton
              title="Create Account"
              marginTop={20}
              disabled={isPending}
              loading={isPending}
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
      </CustomScroll>
    </Container>
  );
}
