/* eslint-disable prettier/prettier */

import { useNetInfo } from "@react-native-community/netinfo";

export const useNetwork = () => {

  const netinfo = useNetInfo();

  return netinfo.isInternetReachable === true;
};
