/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
import { useStore } from '~/lib/zustand/useStore';

export const AddStaffForm = (): JSX.Element => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pharmacyId = useStore((state) => state.id);
  const [edit, setEdit] = useState(false);
  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const { db } = useDrizzle();
  const handleSecure = useCallback(() => setSecure((prev) => !prev), []);
  const handleSecure2 = useCallback(() => setSecure2((prev) => !prev), []);
  const router = useRouter();
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setValue,
  } = useForm<z.infer<typeof addStaffSchema>>({
    defaultValues: {
      confirmPassword: '',
      email: '',
      password: '',
      name: '',
    },
    resolver: zodResolver(addStaffSchema),
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const myStaff = await db.select().from(staff).where(eq(staff.id, +id));

        setValue('name', myStaff[0].name);
        setValue('email', myStaff[0].email);
        setValue('password', myStaff[0].password);
        setValue('confirmPassword', myStaff[0].password);
        setEdit(true);
      } catch (error) {
        console.log(error);
      }
    };
    if (id) {
      fetchStaff();
    }
  }, [id]);
  const onCreate = async (value: z.infer<typeof addStaffSchema>) => {
    try {
      await db.insert(staff).values({ ...value, pharmacyId });
      Toast.show({
        text1: 'Success',
        text2: 'Staff added successfully',
      });
      reset();
      router.back();
    } catch (error) {
      console.log(error);

      Toast.show({
        text1: 'Failed',
        text2: 'Staff was not added successfully',
      });
    }
  };

  const onUpdate = async (value: z.infer<typeof addStaffSchema>) => {
    try {
      await db.update(staff).set(value).where(eq(staff.id, +id));
      Toast.show({
        text1: 'Success',
        text2: 'Staff updated successfully',
      });
      reset();
      setEdit(false);
      router.back();
    } catch (error) {
      console.log(error);

      Toast.show({
        text1: 'Failed',
        text2: 'Staff was not updated successfully',
      });
    }
  };
  const onSubmit = async (value: z.infer<typeof addStaffSchema>) => {
    if (edit) {
      onUpdate(value);
    } else {
      onCreate(value);
    }
  };

  const buttonText = edit ? 'Update' : 'Create';
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
        title={`${buttonText}`}
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
