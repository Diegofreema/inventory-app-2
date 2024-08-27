/* eslint-disable prettier/prettier */

import { Redirect, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

import { Container } from '~/components/Container';
import { Error } from '~/components/ui/Error';
import { Loader } from '~/components/ui/Loading';
import { NavHeader } from '~/components/ui/NavHeader';
import { Products } from '~/components/ui/Products';
import { useGet } from '~/hooks/useGet';
import { useProducts } from '~/lib/tanstack/queries';

const ProductDetails = (): JSX.Element => {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { singleProduct } = useGet(productId);

  if (!productId) return <Redirect href="/" />;

  return (
    <Container>
      <NavHeader title="Product Details" />

      <Products data={[singleProduct!]} show />
    </Container>
  );
};

export default ProductDetails;
