/* eslint-disable prettier/prettier */

import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { View } from 'tamagui';

import { Container } from './Container';
// import { OnlinePharmacy } from './sales/247pharmacy';
import { Offline } from './sales/Offline';
import { ScrollHeader } from './store/ScrollHeader';
const data = ['Pharmacy sales'];
const COMPONENTS = [Offline];
export const Sales = () => {
  const [active, setActive] = useState(0);
  const ActiveComponent = COMPONENTS[active];
  const { width } = useWindowDimensions();
  const isSmallTablet = width >= 500;
  const isBigTablet = width >= 700;
  const containerWidth = isBigTablet ? '60%' : isSmallTablet ? '80%' : '100%';
  return (
    <Container paddingHorizontal={0}>
      <View width={containerWidth} mx="auto">
        <ScrollHeader screens={data} active={active} setActive={setActive} />
      </View>
      <ActiveComponent />
    </Container>
  );
};
