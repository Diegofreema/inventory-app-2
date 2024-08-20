/* eslint-disable prettier/prettier */

import { Redirect, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

import { Container } from '~/components/Container';
import { Error } from '~/components/ui/Error';
import { Loader } from '~/components/ui/Loading';
import { NavHeader } from '~/components/ui/NavHeader';
import { Products } from '~/components/ui/Products';
import { useProducts } from '~/lib/tanstack/queries';

const ProductDetails = (): JSX.Element => {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { data: products, isError, isPending, refetch } = useProducts();

  const product = useMemo(() => {
    return products?.find((p) => p.id === productId);
  }, [productId, products]);
  if (!productId) return <Redirect href="/" />;
  if (isError) return <Error onRetry={refetch} />;

  return (
    <Container>
      <NavHeader title="Product Details" />
      {isPending ? <Loader /> : <Products data={[product!]} show />}
    </Container>
  );
};

export default ProductDetails;
