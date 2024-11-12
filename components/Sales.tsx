/* eslint-disable prettier/prettier */

import { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { View } from 'tamagui';

import { Container } from './Container';
import { Offline } from './sales/Offline';
import { ScrollHeader } from './store/ScrollHeader';

import { OnlinePharmacy } from "~/components/sales/247pharmacy";
// import { OnlinePharmacy } from './sales/247pharmacy';

const data = ['Online sales','Pharmacy sales'];
const COMPONENTS = [OnlinePharmacy,Offline];
export const Sales = () => {
  const [active, setActive] = useState(0);
  const ActiveComponent = COMPONENTS[active];
  const { width } = useWindowDimensions();
  const isMid = width < 768;
  const isSmall = width < 425;

  const finalWidth = isSmall ? '100%' : isMid ? '100%' : '80%';
  return (
    <Container paddingHorizontal={0}>
      <View width={finalWidth} mx="auto">
        <ScrollHeader screens={data} active={active} setActive={setActive} />
      </View>
      <ActiveComponent />
    </Container>
  );
};
