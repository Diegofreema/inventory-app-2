/* eslint-disable prettier/prettier */

import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { StoreActions } from './StoreActions';
import { AnimatedContainer } from '../ui/AniminatedContainer';
import { Error } from '../ui/Error';
import { ProductLoader } from '../ui/Loading';
import { Products } from '../ui/Products';

import { useProducts } from '~/lib/tanstack/queries';

export const StoreProducts = (): JSX.Element => {
  const [value, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const {
    data: products,
    isError,
    isPending,
    refetch,
    isRefetching: isRefetchingProduct,
  } = useProducts();

  const router = useRouter();
  const handleNav = () => {
    router.push('/newItem');
  };
  const onSetValue = useCallback((val: string) => setValue(val), [value]);
  const selectedCategory = useMemo(() => {
    if (selectedValue === null) {
      return products || [];
    }

    return products?.filter(
      (product) => product?.Category.toLowerCase() === selectedValue.toLowerCase()
    );
  }, [selectedValue, products]);
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
  if (isError) {
    return <Error onRetry={refetch} />;
  }
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
      {isPending ? (
        <ProductLoader />
      ) : (
        <Products
          data={filteredProducts}
          onRefetch={refetch}
          isLoading={isRefetchingProduct}
          scrollEnabled
        />
      )}
    </AnimatedContainer>
  );
};
