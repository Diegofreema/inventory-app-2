/* eslint-disable prettier/prettier */

import * as SecureStore from 'expo-secure-store';

import { CartFlatList } from '~/components/CartFlatList';
import { Container } from '~/components/Container';
import { Error } from '~/components/ui/Error';
import { ProductLoader } from '~/components/ui/Loading';
import { NavHeader } from '~/components/ui/NavHeader';
import { useCartItemsWithRef } from '~/lib/tanstack/queries';
const Cart = () => {
  const salesRef = SecureStore.getItem('salesRef');
  const { data, isPending, isError, refetch } = useCartItemsWithRef(salesRef!);


  if (isError) return <Error onRetry={refetch} />;
  if (isPending) return <ProductLoader />;

  return (
    <Container>
      <NavHeader title="Cart" />
      <CartFlatList data={data} />
    </Container>
  );
};

export default Cart;
