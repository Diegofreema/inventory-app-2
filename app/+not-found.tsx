import { Link, Stack } from 'expo-router';
import { H5, Heading, YStack } from 'tamagui';

import { Container } from '~/components/Container';

export default function NotFoundScreen() {
  return (
    <Container>
      <Stack.Screen options={{ title: 'Oops!' }} />

      <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
        <Heading>This screen doesn't exist.</Heading>
        <Link href="/">
          <H5>Go to home screen!</H5>
        </Link>
      </YStack>
    </Container>
  );
}
