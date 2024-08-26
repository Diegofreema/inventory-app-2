/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { View } from 'tamagui';
import { z } from 'zod';

import { CustomController } from './CustomController';
import { MyButton } from '../ui/MyButton';

import { colors } from '~/constants';
import { staff } from '~/db/schema';
import { useDrizzle } from '~/hooks/useDrizzle';
import { addStaffSchema } from '~/lib/validators';

export const AddStaffForm = (): JSX.Element => {
  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const { db } = useDrizzle();
  const handleSecure = useCallback(() => setSecure((prev) => !prev), []);
  const handleSecure2 = useCallback(() => setSecure2((prev) => !prev), []);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm<z.infer<typeof addStaffSchema>>({
    defaultValues: {
      confirmPassword: '',
      email: '',
      password: '',
      name: '',
    },
    resolver: zodResolver(addStaffSchema),
  });

  const onSubmit = async (value: z.infer<typeof addStaffSchema>) => {
    try {
      await db.insert(staff).values(value);
      Toast.show({
        text1: 'Success',
        text2: 'Staff added successfully',
      });
      reset();
    } catch (error) {
      console.log(error);

      Toast.show({
        text1: 'Failed',
        text2: 'Staff was not added successfully',
      });
    }
  };
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
