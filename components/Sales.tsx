/* eslint-disable prettier/prettier */

import { useState } from 'react';

import { Container } from './Container';
// import { OnlinePharmacy } from './sales/247pharmacy';
import { Offline } from './sales/Offline';
import { ScrollHeader } from './store/ScrollHeader';
const data = ['Pharmacy sales'];
const COMPONENTS = [Offline];
export const Sales = () => {
  const [active, setActive] = useState(0);
  const ActiveComponent = COMPONENTS[active];
  return (
    <Container paddingHorizontal={0}>
      <ScrollHeader screens={data} active={active} setActive={setActive} />
      <ActiveComponent />
    </Container>
  );
};
