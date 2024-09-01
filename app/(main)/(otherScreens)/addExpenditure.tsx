/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Stack } from 'tamagui';
import { z } from 'zod';

import { Container } from '~/components/Container';
import { CustomController } from '~/components/form/CustomController';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { colors } from '~/constants';
import { useAddAccount } from '~/lib/tanstack/mutations';
import { expenditureSchema } from '~/lib/validators';

export default function AddExpenditure() {
  const { mutateAsync, isPending, error } = useAddAccount();
  console.log(error);

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

  const onSubmit = (values: z.infer<typeof expenditureSchema>) => {
    mutateAsync({
      name: values.accountName.charAt(0)?.toUpperCase() + values.accountName.slice(1),
    });
    console.log(error);

    if (!error) {
      reset();
    }
  };
  return (
    <Container>
      <NavHeader title="Add Expenditure" />
      <CustomScroll>
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
      </CustomScroll>
    </Container>
  );
}
