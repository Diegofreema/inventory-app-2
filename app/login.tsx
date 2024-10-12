/* eslint-disable prettier/prettier */
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useWindowDimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'tamagui';

import { Container } from '~/components/Container';
import { LoginForm } from '~/components/form/LoginForm';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { CustomHeading, CustomSubHeading } from '~/components/ui/typography';
import { useHasFetched } from '~/lib/zustand/useIsFirstTime';
import { useStore } from '~/lib/zustand/useStore';

export default function Login() {
  const id = useStore((state) => state.id);
  const { hasFetched } = useHasFetched();
  const { width } = useWindowDimensions();

  if (id && hasFetched) return <Redirect href="/" />;
  if (id && !hasFetched) return <Redirect href="/loading" />;

  const isSmallTablet = width >= 500;
  const isBigTablet = width >= 700;
  const containerWidth = isSmallTablet ? '50%' : isBigTablet ? '70%' : '100%';
  const alignPosition = isSmallTablet ? 'center' : 'left';
  return (
    // @ts-ignore
    <>
      <StatusBar style="dark" backgroundColor="white" translucent animated />
      <SafeAreaProvider style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <Container paddingTop="$6">
            <CustomScroll>
              <Stack mx="auto" width={containerWidth}>
                <CustomHeading text="Welcome Back" textAlign={alignPosition} />
                <CustomSubHeading
                  text="Enter your Login details on to continue"
                  textAlign={alignPosition}
                />

                <Stack marginTop={50}>
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
