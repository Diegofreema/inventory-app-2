/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { Stack } from 'tamagui';
import { z } from 'zod';

import { CustomController } from './CustomController';
import { MyButton } from '../ui/MyButton';

import { colors } from '~/constants';
import { api } from '~/lib/helper';
import { loginSchema } from '~/lib/validators';
import { useStore } from '~/lib/zustand/useStore';
export const LoginForm = (): JSX.Element => {
  const [secure, setSecure] = useState(true);
  const getId = useStore((state) => state.getId);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      const { data } = await axios.get(
        `${api}api=adminlogin&email=${values.email}&pasword=${values.password}`
      );
      if (data?.result === 'incorrect password') {
        Toast.show({
          type: 'green',
          autoHide: true,
          swipeable: true,
          position: 'top',
          text1: 'Error',
          text2: 'Incorrect credentials',
        });

        return;
      }
      if (data?.result === 'failed') {
        Toast.show({
          type: 'green',
          autoHide: true,
          swipeable: true,
          position: 'top',
          text1: 'Error',
          text2: 'Something went wrong, please try again',
        });
        return;
      }

      Toast.show({
        type: 'green',
        autoHide: true,
        swipeable: true,
        position: 'top',
        text1: 'Success',
        text2: 'Welcome back',
      });
      getId(data?.result);
      reset();
    } catch (error: any) {
      console.log(JSON.stringify(error));
      Toast.show({
        type: 'green',
        autoHide: true,
        swipeable: true,
        position: 'top',
        text1: 'Error',
        text2: 'Something went wrong, please try again',
      });
    }
  };

  const handleSecure = useCallback(() => setSecure((prev) => !prev), []);
  return (
    <Stack gap={10}>
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
      <MyButton
        title="Login"
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
    </Stack>
  );
};
