/* eslint-disable prettier/prettier */

import { zodResolver } from "@hookform/resolvers/zod";
import { Q } from "@nozbe/watermelondb";
import axios from "axios";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Stack, Text, XStack } from "tamagui";
import { z } from "zod";

import { CustomController } from "./CustomController";
import { LoadingModal } from "../modals/LoadingModal";
import { CustomPressable } from "../ui/CustomPressable";
import { MyButton } from "../ui/MyButton";

import { colors } from "~/constants";
import { staffs } from "~/db";
import { loginSchema } from "~/lib/validators";
import { useShowToast } from "~/lib/zustand/useShowToast";
import { useStore } from "~/lib/zustand/useStore";

export const LoginForm = () => {
  const [secure, setSecure] = useState(true);
  const [admin, setAdmin] = useState(true);
  const [loading, setLoading] = useState(false);
  const toast = useShowToast((state) => state.onShow);

  const getId = useStore((state) => state.getId);
  const onSetAdmin = useStore((state) => state.setIsAdmin);
  const getStaffId = useStore((state) => state.getStaffId);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof loginSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });

  const onAdminLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `https://247api.netpro.software/api.aspx?api=adminlogin&email=${values.email}&pasword=${values.password}`
      );
      if (data?.result === 'incorrect password') {
        toast({ message: 'Error', description: 'Incorrect credentials', type: 'error' });

        return;
      }
      if (data?.result === 'failed') {
        toast({
          message: 'Error',
          description: 'Something went wrong, please try again',
          type: 'error',
        });
        return;
      }

      toast({ message: 'Success', description: 'Welcome back', type: 'success' });
      getId(data?.result);
      onSetAdmin(true);
      reset();
    } catch (error: any) {
      console.log(JSON.stringify(error));
      toast({
        message: 'Error',
        description: 'Something went wrong, please try again',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };



  const onStaffLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    try {
      const staffExists = await staffs.query(Q.where('email', values.email), Q.take(1)).fetch();
      if (!staffExists.length) {
        toast({ message: 'Error', description: 'Staff does not exist', type: 'error' });
        return;
      }
      const passwordMatch = staffExists[0].password === values.password;
      if (!passwordMatch) {
        toast({ message: 'Error', description: 'Incorrect password', type: 'error' });
        return;
      }
      toast({ message: 'Success', description: 'Welcome back', type: 'success' });

      getStaffId(staffExists[0].id.toString())
      getId(staffExists[0].pharmacyId!);
      onSetAdmin(false);
      reset();
    } catch (error) {
      console.log(error);

      toast({
        message: 'Error',
        description: 'Something went wrong, please try again',
        type: 'error',
      });
    } finally {
      setLoading(false);
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
    // @ts-ignore
    <>
      <LoadingModal visible={isSubmitting} />

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
        {!isSubmitting && (
          <MyButton
            title="Login"
            marginTop={20}
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
        )}
      </Stack>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,

    borderRadius: 5,
  },
});
