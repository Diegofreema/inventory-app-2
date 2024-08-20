/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'tamagui';
import { z } from 'zod';

import { CustomController } from './CustomController';
import { MyButton } from '../ui/MyButton';

import { colors } from '~/constants';
import { addStaffSchema } from '~/lib/validators';

export const AddStaffForm = (): JSX.Element => {
  const [secure, setSecure] = useState(false);
  const [secure2, setSecure2] = useState(false);
  const handleSecure = useCallback(() => setSecure((prev) => !prev), []);
  const handleSecure2 = useCallback(() => setSecure2((prev) => !prev), []);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<z.infer<typeof addStaffSchema>>({
    defaultValues: {
      confirmPassword: '',
      email: '',
      password: '',
      name: '',
    },
    resolver: zodResolver(addStaffSchema),
  });

  const onSubmit = (value: z.infer<typeof addStaffSchema>) => {};
  return (
    <View gap={10}>
      <CustomController
        name="name"
        placeholder="Full name"
        control={control}
        errors={errors}
        label="Full Name"
      />
      <CustomController
        name="email"
        placeholder="E.g. Johndoe@gmail.com"
        control={control}
        errors={errors}
        label="Email"
        type="email-address"
      />
      <CustomController
        name="password"
        placeholder="*********"
        control={control}
        errors={errors}
        label="Password"
        secure={secure}
        password
        handleSecure={handleSecure}
      />
      <CustomController
        name="confirmPassword"
        placeholder="*********"
        control={control}
        errors={errors}
        label="Confirm password"
        secure={secure2}
        password
        handleSecure={handleSecure2}
      />
      <MyButton
        title="Create staff"
        mt={20}
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
    </View>
  );
};
