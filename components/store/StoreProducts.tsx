/* eslint-disable prettier/prettier */

import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { StoreActions } from './StoreActions';
import { AnimatedContainer } from '../ui/AniminatedContainer';
import { PaginationButton } from '../ui/PaginationButton';
import { Products } from '../ui/Products';

import { useProducts } from '~/lib/tanstack/queries';

export const StoreProducts = (): JSX.Element => {
  const [value, setValue] = useState('');
  const [page, setPage] = useState(1);
  const { data: products, refetch: fetchData, isLoading: fetching } = useProducts(page);

  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const handlePagination = useCallback((direction: 'next' | 'prev') => {
    setPage((prev) => prev + (direction === 'next' ? 1 : -1));
  }, []);

  const isLastPage = useMemo(() => {
    if (!products?.count) return false;

    return products?.count <= page * 10;
  }, [products?.count, page]);
  const router = useRouter();
  const handleNav = () => {
    router.push('/newItem');
  };
  const onSetValue = useCallback((val: string) => setValue(val), [value]);
  const selectedCategory = useMemo(() => {
    if (selectedValue === null) {
      return products?.product || [];
    }

    return products?.product?.filter(
      (product) => product?.category?.toLowerCase() === selectedValue.toLowerCase()
    );
  }, [selectedValue, products?.product]);
  const filteredProducts = useMemo(() => {
    if (!value.trim()) {
      return selectedCategory || [];
    }

    const lowercasedValue = value.toLowerCase();
    return (
      selectedCategory?.filter((product) =>
        product?.product?.toLowerCase().includes(lowercasedValue)
      ) || []
    );
  }, [selectedCategory, value]);

  return (
    <AnimatedContainer>
      <StoreActions
        show
        placeholder="Product name"
        title="Product"
        setVal={onSetValue}
        val={value}
        value={selectedValue}
        setValue={setSelectedValue}
        onPress={handleNav}
      />

      <Products
        data={filteredProducts}
        scrollEnabled
        navigate
        onRefetch={fetchData}
        isLoading={fetching}
        pagination={
          products?.product?.length ? (
            <PaginationButton
              handlePagination={handlePagination}
              page={page}
              isLastPage={isLastPage}
            />
          ) : (
            <></>
          )
        }
      />
    </AnimatedContainer>
  );
};
