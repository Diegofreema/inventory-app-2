/* eslint-disable prettier/prettier */

import { ScrollView } from "react-native";

import { CartFlatList } from "~/components/CartFlatList";
import { Container } from "~/components/Container";
import { Error } from "~/components/ui/Error";
import { ProductLoader } from "~/components/ui/Loading";
import { NavHeader } from "~/components/ui/NavHeader";
import { useCartItemsWithRef } from "~/lib/tanstack/queries";
import { useGetRef } from "~/lib/zustand/useSaleRef";

const Cart = () => {
  const salesRef = useGetRef(state => state.saleRef);

  const { data, isPending, isError, refetch } = useCartItemsWithRef(salesRef);


  if (isError) return <Error onRetry={refetch} />;
  if (isPending) return <ProductLoader />;

  return (
    <Container>
      <NavHeader title="Cart" />
      <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <CartFlatList data={data} />
      </ScrollView>
    </Container>
  );
};

export default Cart;
