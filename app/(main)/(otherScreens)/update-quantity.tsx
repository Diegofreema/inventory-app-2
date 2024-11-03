import { useWindowDimensions } from 'react-native';
import { View } from 'tamagui';

import { Container } from '~/components/Container';
import { UpdateQuantityForm } from '~/components/form/UpdateQuantity';
import { CustomScroll } from '~/components/ui/CustomScroll';

export default function UpdateQuantity() {
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  const isBigTablet = width >= 700;
  const containerWidth = isBigTablet ? '60%' : isSmallTablet ? '80%' : '100%';
  return (
    <Container paddingHorizontal={0}>
      <View width={containerWidth} mx="auto">
        <CustomScroll scroll>
          <UpdateQuantityForm />
        </CustomScroll>
      </View>
    </Container>
  );
}
