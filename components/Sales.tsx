/* eslint-disable prettier/prettier */

import { useState } from 'react';

import { Container } from './Container';
import { OnlinePharmacy } from './sales/247pharmacy';
import { Offline } from './sales/Offline';
import { ScrollHeader } from './store/ScrollHeader';
const data = ['247Pharmacy sales', 'Pharmacy sales'];
const COMPONENTS = [OnlinePharmacy, Offline];
export const Sales = () => {
  const [active, setActive] = useState(0);
  const ActiveComponent = COMPONENTS[active] || OnlinePharmacy;
  return (
    <Container px={0}>
      <ScrollHeader screens={data} active={active} setActive={setActive} />
      <ActiveComponent />
    </Container>
  );
};
