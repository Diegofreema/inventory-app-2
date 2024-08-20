import { YStack } from 'tamagui';

export const Container = ({
  children,
  pt,
  px = '$4',
}: {
  children: React.ReactNode;
  pt?: any;
  px?: any;
}) => {
  return (
    <YStack flex={1} px={px} pt={pt} bg="white">
      {children}
    </YStack>
  );
};
