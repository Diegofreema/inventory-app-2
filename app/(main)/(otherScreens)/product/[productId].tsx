/* eslint-disable prettier/prettier */

import { Redirect, useLocalSearchParams } from 'expo-router';

import { Container } from '~/components/Container';
import { NavHeader } from '~/components/ui/NavHeader';
import { Products } from '~/components/ui/Products';
import { useGet } from '~/hooks/useGet';

const ProductDetails = (): JSX.Element => {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { singleProduct } = useGet(productId);

  if (!productId || !singleProduct?.productId) return <Redirect href="/" />;

  return (
    <Container>
      <NavHeader title="Product Details" />
      <Products data={[singleProduct!]} show />
    </Container>
  );
};

export default ProductDetails;
