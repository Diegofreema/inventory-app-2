/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Stack } from 'tamagui';
import { z } from 'zod';

import { Container } from '~/components/Container';
import { CustomController } from '~/components/form/CustomController';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { Error } from '~/components/ui/Error';
import { FormLoader } from '~/components/ui/Loading';
import { MyButton } from '~/components/ui/MyButton';
import { NavHeader } from '~/components/ui/NavHeader';
import { colors } from '~/constants';
import { useAddExp } from '~/lib/tanstack/mutations';
import { useExpAcc } from '~/lib/tanstack/queries';
import { expenseSchema } from '~/lib/validators';

export default function AddExpense() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const { mutateAsync, isPending, error } = useAddExp();
  const { data: exp, isPending: expPending, isError, refetch } = useExpAcc();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof expenseSchema>>({
    defaultValues: {
      accountName: name || '',
      amount: '',
      description: '',
    },

    resolver: zodResolver(expenseSchema),
  });
  const expenses = useMemo(() => {
    return exp?.map((ex) => ({
      label: ex.accountName,
      value: ex.accountName,
    }));
  }, [exp]);
  const onSubmit = (values: z.infer<typeof expenseSchema>) => {
    mutateAsync({
      amount: values.amount,
      description: values.description,
      name: values.accountName?.charAt(0)?.toUpperCase() + values.accountName.slice(1),
    });

    if (!error) {
      reset();
    }
  };

  if (name && isError) return <Error onRetry={refetch} />;

  if (expPending) return <FormLoader />;
  return (
    <Container>
      <NavHeader title="Add Expense" />

      <CustomScroll>
        <Stack gap={10}>
          <CustomController
            name="accountName"
            placeholder="Account Name"
            control={control}
            errors={errors}
            label="Account name"
            variant={name ? 'text' : 'select'}
            data={expenses}
            setValue={setValue}
          />
          <CustomController
            name="amount"
            placeholder="Amount in naira"
            control={control}
            errors={errors}
            label="Amount in naira"
            type="numeric"
          />
          <CustomController
            name="description"
            placeholder="Description"
            control={control}
            errors={errors}
            label="Description"
            variant="textarea"
          />

          <MyButton
            title="Add expense"
            mt={20}
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
