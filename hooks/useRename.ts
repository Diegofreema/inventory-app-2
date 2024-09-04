import { useEffect } from 'react';

import {
  nameUnnamedDisposed,
  nameUnnamedSales,
  nameUnnamedSalesOffline,
  nameUnnamedSupply,
} from '~/lib/helper';

export const useRename = () => {
  useEffect(() => {
    const rename = async () => {
      await Promise.all([
        nameUnnamedSales(),
        nameUnnamedSupply(),
        nameUnnamedDisposed(),
        nameUnnamedSalesOffline(),
      ]);
    };

    rename();
  }, []);
};
