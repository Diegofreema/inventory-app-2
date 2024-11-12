import { useWindowDimensions } from 'react-native';
import { View } from 'tamagui';

import { Container } from '~/components/Container';
import { UpdatePriceForm } from '~/components/form/UpdatePriceForm';
import { CustomScroll } from '~/components/ui/CustomScroll';

export default function UpdatePrice() {
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  const isBigTablet = width >= 700;
  const containerWidth = isBigTablet ? '60%' : isSmallTablet ? '80%' : '100%';
  return (
    <Container paddingHorizontal={0}>
      <View width={containerWidth} mx="auto">
        <CustomScroll scroll>
          <UpdatePriceForm />
        </CustomScroll>
      </View>
    </Container>
  );
}
