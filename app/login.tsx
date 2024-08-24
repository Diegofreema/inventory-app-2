/* eslint-disable prettier/prettier */
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'tamagui';

import { Container } from '~/components/Container';
import { LoginForm } from '~/components/form/LoginForm';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { CustomHeading, CustomSubHeading } from '~/components/ui/typography';
import { useStore } from '~/lib/zustand/useStore';

export default function Login() {
  const id = useStore((state) => state.id);
  if (id) return <Redirect href="/" />;
  return (
    <>
      <StatusBar style="dark" backgroundColor="white" translucent animated />
      <SafeAreaProvider style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Container pt="$6">
            <CustomScroll>
              <Stack>
                <CustomHeading text="Welcome Back" />
                <CustomSubHeading text="Enter your Login details on to continue" />

                <Stack mt={50}>
                  <LoginForm />
                </Stack>
              </Stack>
            </CustomScroll>
          </Container>
        </SafeAreaView>
      </SafeAreaProvider>
    </>
  );
}
