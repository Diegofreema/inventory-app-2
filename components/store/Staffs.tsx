/* eslint-disable prettier/prettier */
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { StoreActions } from './StoreActions';
import { AnimatedContainer } from '../ui/AniminatedContainer';

export const Staffs = (): JSX.Element => {
  const [value, setValue] = useState('');
  const router = useRouter();
  const handleNav = useCallback(() => {
    router.push('/addStaff');
  }, []);
  return (
    <AnimatedContainer>
      <StoreActions
        setVal={setValue}
        val={value}
        onPress={handleNav}
        placeholder="By Staff Name"
        title="Staff"
      />
    </AnimatedContainer>
  );
};
