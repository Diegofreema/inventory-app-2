/* eslint-disable prettier/prettier */

import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { StoreActions } from './StoreActions';
import { AnimatedContainer } from '../ui/AniminatedContainer';
import { Products } from '../ui/Products';

import { useGet } from '~/hooks/useGet';

export const StoreProducts = (): JSX.Element => {
  const [value, setValue] = useState('');
  const { products } = useGet();
  const [selectedValue, setSelectedValue] = useState<string | null>(null);

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
      (product) => product?.category?.toLowerCase() === selectedValue.toLowerCase()
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

      <Products data={filteredProducts} scrollEnabled navigate />
    </AnimatedContainer>
  );
};
