/* eslint-disable prettier/prettier */

import { useEffect } from 'react';

import { useDrizzle } from './useDrizzle';
import { useNetwork } from './useNetwork';

/* eslint-disable prettier/prettier */
export const useUploadOffline = () => {
  const isConnected = useNetwork();
  const { db } = useDrizzle();
  useEffect(() => {
    const upload = async () => {
      const [supply] = await Promise.all([db.query.supplyProduct.findMany()]);

      if (supply.length) {
      }
    };

    if (isConnected) upload();
  }, []);
};
