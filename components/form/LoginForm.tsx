/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { Stack, Text, XStack } from 'tamagui';
import { z } from 'zod';

import { CustomController } from './CustomController';
import { CustomPressable } from '../ui/CustomPressable';
import { MyButton } from '../ui/MyButton';

import { colors } from '~/constants';
import { useDrizzle } from '~/hooks/useDrizzle';
import { api } from '~/lib/helper';
import { loginSchema } from '~/lib/validators';
import { useStore } from '~/lib/zustand/useStore';

export const LoginForm = (): JSX.Element => {
  const [secure, setSecure] = useState(true);
  const [admin, setAdmin] = useState(true);
  const [loading, setLoading] = useState(false);
  const getId = useStore((state) => state.getId);
  const onSetAdmin = useStore((state) => state.setIsAdmin);
  const { db, schema } = useDrizzle();
  const { data } = useLiveQuery(db.select().from(schema.staff));
  console.log(data);

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

  const onAdminLogin = async (values: z.infer<typeof loginSchema>) => {
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
      onSetAdmin(true);
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

  const onStaffLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      const staffExists = await db.query.staff.findFirst({
        where: eq(schema.staff.email, values.email),
      });
      if (!staffExists) {
        Toast.show({
          position: 'top',
          text1: 'Error',
          text2: 'Staff does not exist',
        });
        return;
      }
      const passwordMatch = staffExists.password === values.password;
      if (!passwordMatch) {
        Toast.show({
          position: 'top',
          text1: 'Error',
          text2: 'Incorrect password',
        });
        return;
      }
      Toast.show({
        position: 'top',
        text1: 'Success',
        text2: 'Welcome back',
      });
      SecureStore.setItem('staffId', staffExists.id.toString());
      getId(staffExists.pharmacyId!);
      onSetAdmin(false);
      reset();
    } catch (error) {
      console.log(error);

      Toast.show({
        text1: 'Error',
        text2: 'Something went wrong, please try again',
      });
    }
  };
  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    if (admin) {
      onAdminLogin(values);
    } else {
      onStaffLogin(values);
    }
    setLoading(false);
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
      <XStack justifyContent="space-between" gap={10}>
        <CustomPressable
          onPress={() => setAdmin(true)}
          style={[
            styles.container,
            {
              backgroundColor: admin ? colors.green : 'transparent',
              borderColor: colors.green,
            },
          ]}>
          <Text color={admin ? colors.white : colors.green} textAlign="center">
            Admin login
          </Text>
        </CustomPressable>
        <CustomPressable
          style={[
            styles.container,
            { backgroundColor: admin ? 'transparent' : colors.green, borderColor: colors.green },
          ]}
          onPress={() => setAdmin(false)}>
          <Text color={admin ? colors.green : colors.white} textAlign="center">
            Staff login
          </Text>
        </CustomPressable>
      </XStack>
      <MyButton
        title="Login"
        mt={20}
        disabled={loading}
        loading={loading}
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

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,

    borderRadius: 5,
  },
});
