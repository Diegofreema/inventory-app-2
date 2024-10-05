/* eslint-disable prettier/prettier */

import { Redirect, useLocalSearchParams } from 'expo-router';

import { Container } from '~/components/Container';
import { NavHeader } from '~/components/ui/NavHeader';
import SingleProduct from '~/components/ui/SingleProduct';

const ProductDetails = (): JSX.Element => {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  console.log(productId);

  if (!productId) return <Redirect href="/" />;

  return (
    <Container>
      <NavHeader title="Product Details" />
      <SingleProduct productId={productId} />
    </Container>
  );
};

export default ProductDetails;
