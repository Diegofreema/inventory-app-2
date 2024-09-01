import { YStack } from 'tamagui';

export const Container = ({
  children,
  paddingTop,
  paddingHorizontal = '$4',
}: {
  children: React.ReactNode;
  paddingTop?: any;
  paddingHorizontal?: any;
}) => {
  return (
    <YStack
      flex={1}
      paddingHorizontal={paddingHorizontal}
      paddingTop={paddingTop}
      backgroundColor="white">
      {children}
    </YStack>
  );
};
