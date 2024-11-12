/* eslint-disable prettier/prettier */

import  { useNetInfo } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const useNetwork = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(false);
  const netinfo = useNetInfo();
  const isOffline = netinfo.isInternetReachable === false;
  useEffect(() => {
    if (isOffline) {
      setIsConnected(false);
    } else {
      setIsConnected(true);
    }
  }, [isOffline]);

  return isConnected;
};
