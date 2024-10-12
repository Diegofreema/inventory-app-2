/* eslint-disable prettier/prettier */

import { useWindowDimensions } from 'react-native';
import { View } from 'tamagui';

import { Container } from '~/components/Container';
import { AddStaffForm } from '~/components/form/AddStaffForm';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { NavHeader } from '~/components/ui/NavHeader';

const AddStaff = (): JSX.Element => {
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  const isBigTablet = width >= 700;
  const containerWidth = isBigTablet ? '60%' : isSmallTablet ? '80%' : '100%';
  return (
    <Container>
      <View width={containerWidth} mx="auto">
        <NavHeader title="Add staff" />
        <CustomScroll>
          <AddStaffForm />
        </CustomScroll>
      </View>
    </Container>
  );
};

export default AddStaff;
