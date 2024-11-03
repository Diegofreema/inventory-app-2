/* eslint-disable prettier/prettier */

import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const useNetwork = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log(isConnected, 'hgvhbhgvhv');
      setIsConnected(state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  return isConnected;
};
