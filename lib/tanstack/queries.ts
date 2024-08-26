/* eslint-disable prettier/prettier */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { eq } from 'drizzle-orm';

import { api, getDisposal, getExpenditure, getInfo, getSale, getSalesP } from '../helper';
import { useStore } from '../zustand/useStore';

import { useDrizzle } from '~/hooks/useDrizzle';
import { CatType, ExpType, InfoType, NotType, SalesP, SalesS, SupplyType } from '~/type';

export const useProducts = () => {
  const id = useStore((state) => state.id);
  const { db, schema } = useDrizzle();
  const getProducts = async () => {
    const response = await axios.get(`${api}api=getproducts&cidx=${id}`);
    let data = [];
    if (Object.prototype.toString.call(response.data) === '[object Object]') {
      data.push(response.data);
    } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
      data = [...response.data];
    }

    const formattedProducts = data.map((product) => ({
      ...product,
      category: product.Category,
      subcategory: product.Subcategory,
    }));
    await db.insert(schema.product).values(formattedProducts).onConflictDoNothing();

    return data;
  };
  return useQuery({
    queryKey: ['product', id],
    queryFn: getProducts,
  });
};
export const useSalesP = () => {
  const id = useStore((state) => state.id);
  const { db, schema } = useDrizzle();
  return useQuery<SalesP[]>({
    queryKey: ['salesPharmacy', id],
    queryFn: async () => {
      const data = await getSalesP(id!);
      await db.insert(schema.PharmacySales).values(data).onConflictDoNothing();
      return data;
    },
  });
};
export const useSalesS = () => {
  const id = useStore((state) => state.id);
  const { db, schema } = useDrizzle();
  return useQuery<SalesS[]>({
    queryKey: ['salesStore', id],
    queryFn: async () => {
      const data = await getSale(id!);
      const previousStoreSales = await db.query.StoreSales.findMany();
      data.forEach((d) => {
        if (!previousStoreSales[d.datex]) {
          db.insert(schema.StoreSales).values(d).onConflictDoNothing();
        }
      });

      return data;
    },
  });
};
export const useExpenditure = () => {
  const id = useStore((state) => state.id);

  return useQuery<ExpType[]>({
    queryKey: ['expenditure', id],
    queryFn: () => getExpenditure(id),
  });
};
export const useCat = () => {
  const getCat = async () => {
    const response = await axios.get(`${api}api=productcategory`);
    let data = [];
    if (Object.prototype.toString.call(response.data) === '[object Object]') {
      data.push(response.data);
    } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
      data = [...response.data];
    }

    return data;
  };
  return useQuery<CatType[]>({
    queryKey: ['cat'],
    queryFn: getCat,
  });
};
export const useInfo = () => {
  const id = useStore((state) => state.id);
  const getInfo = async () => {
    const { data } = await axios.get(`${api}api=pharmacyinfor&cidx=${id}`);

    return data;
  };
  return useQuery<InfoType>({
    queryKey: ['info', id],
    queryFn: getInfo,
  });
};
export const useSupply = () => {
  const id = useStore((state) => state.id);

  return useQuery<SupplyType[]>({
    queryKey: ['supply', id],
    queryFn: () => getInfo(id),
  });
};
export const useExpAcc = () => {
  const id = useStore((state) => state.id);
  const getExpAcc = async () => {
    const response = await axios.get(`${api}api=getexpensact&cidx=${id}`);
    let data = [];
    if (Object.prototype.toString.call(response.data) === '[object Object]') {
      data.push(response.data);
    } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
      data = [...response.data];
    }

    return data;
  };
  return useQuery<{ accountname: string }[]>({
    queryKey: ['exp_name', id],
    queryFn: getExpAcc,
  });
};

export const useNotify = () => {
  const id = useStore((state) => state.id);
  const getNot = async () => {
    const response = await axios.get(`${api}api=get247notification&cidx=${id}`);
    let data = [];
    if (Object.prototype.toString.call(response.data) === '[object Object]') {
      data.push(response.data);
    } else if (Object.prototype.toString.call(response.data) === '[object Array]') {
      data = [...response.data];
    }

    return data;
  };
  return useQuery<NotType[]>({
    queryKey: ['not', id],
    queryFn: getNot,
    refetchInterval: 500 * 60,
  });
};
export const useDisposal = () => {
  const id = useStore((state) => state.id);

  return useQuery<SupplyType[]>({
    queryKey: ['disposal', id],
    queryFn: () => getDisposal(id),
  });
};
