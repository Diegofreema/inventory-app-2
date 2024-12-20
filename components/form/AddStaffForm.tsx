/* eslint-disable prettier/prettier */

import { zodResolver } from '@hookform/resolvers/zod';
import { Q } from '@nozbe/watermelondb';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'tamagui';
import { z } from 'zod';

import { CustomController } from './CustomController';
import { MyButton } from '../ui/MyButton';

import { colors } from '~/constants';
import database, { staffs } from '~/db';
import { addStaffSchema } from '~/lib/validators';
import { useShowToast } from '~/lib/zustand/useShowToast';
import { useStore } from '~/lib/zustand/useStore';

export const AddStaffForm = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useShowToast((state) => state.onShow);

  const pharmacyId = useStore((state) => state.id);
  const [edit, setEdit] = useState(false);
  const [secure, setSecure] = useState(true);
  const [secure2, setSecure2] = useState(true);

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
        const myStaff = await staffs.find(id);

        setValue('name', myStaff.name);
        setValue('email', myStaff.email);
        setValue('password', myStaff.password);
        setValue('confirmPassword', myStaff.password);
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
    if (!pharmacyId) return;
    try {
      const emailExists = await staffs.query(Q.where('email', value.email), Q.take(1)).fetch();
      if (emailExists.length) {
        toast({ message: 'Error', description: 'Email already exists', type: 'error' });
        return;
      }

      await database.write(async () => {
        await staffs.create((staff) => {
          staff.name = value.name;
          staff.email = value.email;
          staff.password = value.password;
          staff.pharmacyId = pharmacyId;
        });
      });
      toast({ message: 'Success', description: 'Staff added successfully', type: 'success' });
      reset();
      router.back();
    } catch (error) {
      console.log(error);
      toast({ message: 'Failed', description: 'Staff was not added successfully', type: 'error' });
    }
  };

  const onUpdate = async (value: z.infer<typeof addStaffSchema>) => {
    try {
      await database.write(async () => {
        const staff = await staffs.find(id);
        await staff.update((staff) => {
          staff.name = value.name;
          staff.email = value.email;
          staff.password = value.password;
        });
      });
      toast({ message: 'Success', description: 'Staff updated successfully', type: 'success' });
      reset();
      setEdit(false);
      router.back();
    } catch (error) {
      console.log(error);

      toast({
        message: 'Failed',
        description: 'Staff was not updated successfully',
        type: 'error',
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
    </View>
  );
};
