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

  const router = useRouter();
  const handleNav = () => {
    router.push('/newItem');
  };
  const onSetValue = useCallback((val: string) => setValue(val), [value]);
  const selectedCategory = useMemo(() => {
    if (selectedValue === null) {
      return products?.allProducts || [];
    }

    return products?.allProducts?.filter(
      (product) => product?.category?.toLowerCase() === selectedValue.toLowerCase()
    );
  }, [selectedValue, products?.allProducts]);
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
  const isLastPage = useMemo(() => {
    if (!products?.count) return false;

    return products?.count <= page * 10;
  }, [products?.count, page]);
  const productsToRender = useMemo(() => {
    if (!value) {
      return products?.product || [];
    } else {
      return filteredProducts;
    }
  }, [value, products, filteredProducts]);
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
        data={productsToRender}
        scrollEnabled
        navigate
        onRefetch={fetchData}
        isLoading={fetching}
        pagination={
          filteredProducts?.length && !value ? (
            <PaginationButton
              handlePagination={handlePagination}
              page={page}
              isLastPage={isLastPage}
            />
          ) : (
            // @ts-ignore
            <></>
          )
        }
      />
    </AnimatedContainer>
  );
};
