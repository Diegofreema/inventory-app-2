/* eslint-disable prettier/prettier */
// import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite';
// import { useSQLiteContext } from 'expo-sqlite';
import { useMemo } from 'react';
import { RefreshControl } from 'react-native';
import { ScrollView } from 'tamagui';

import { Container } from '~/components/Container';
import { DashBoardCards } from '~/components/home/DashBoardCards';
import { Error } from '~/components/ui/Error';
import { ProductLoader } from '~/components/ui/Loading';
import { Products } from '~/components/ui/Products';
import { CustomHeading } from '~/components/ui/typography';
// import * as schema from '~/db/schema';
import { useProducts, useSalesP, useSalesS } from '~/lib/tanstack/queries';

export default function Home() {
  // const database = useSQLiteContext();
  // const db = drizzle(database, { schema });
  // const { data } = useLiveQuery(db.select().from(schema.product));
  // console.log(data);

  const { data, isError, isPending, refetch, isRefetching: isRefetchingProduct } = useProducts();
  const {
    data: dataP,
    isError: isErrorP,
    isPending: isPendingP,
    refetch: refetchP,
    isRefetching,
  } = useSalesP();
  const {
    data: dataS,
    isError: isErrorS,
    isPending: isPendingS,
    refetch: refetchS,

    isRefetching: isRefetchingP,
  } = useSalesS();
  const isReloading = isRefetching || isRefetchingP || isRefetchingProduct;
  // const {
  //   data: dataExp,
  //   isError: isErrorExp,
  //   isPending: isPendingExp,
  //   refetch: refetchExp,
  // } = useExpenditure();
  const limitedProducts = useMemo(() => data?.slice(0, 5), [data]);
  const products = useMemo(() => data, [data]);
  const isLoading = useMemo(() => isPendingP || isPendingS, [isPendingP, isPendingS]);

  // const loading = useMemo(
  //   () => isPendingP || isPendingS || isPendingExp,
  //   [isPendingP, isPendingS, isPendingExp]
  // );
  // const incomeArray = useMemo(() => {
  //   if(!dataS || !dataP) return []
  //   const storeIncome = dataS?.map((p) => ({ name: p?., price: p?.unitprice }));
  //   const pharmacyIncome = dataP?.map((p) => ({ date: p?., price: p?.dealershare }));
  //    storeIncome?.concat(pharmacyIncome || []);
  //    if (!dataExp) return [];

  //    const groupedExpenses = storeIncome.reduce((acc: any, exp) => {
  //      if (!acc[exp.]) {
  //        acc[exp.accountname] = { name: exp.accountname, amount: 0 };
  //      }
  //      acc[exp.accountname].amount += Number(exp.amount);
  //      return acc;
  //    }, {});

  //    return Object.values(groupedExpenses);
  // }, [dataS, dataP]);

  // const expense: ChartType[] = useMemo(() => {
  //   if (!dataExp) return [];

  //   const groupedExpenses = dataExp.reduce((acc: any, exp) => {
  //     if (!acc[exp.accountname]) {
  //       acc[exp.accountname] = { name: exp.accountname, amount: 0 };
  //     }
  //     acc[exp.accountname].amount += Number(exp.amount);
  //     return acc;
  //   }, {});

  //   return Object.values(groupedExpenses);
  // }, [dataExp]);

  const storeSales = useMemo(() => dataS, [dataS]);
  const pharmacySales = useMemo(() => dataP, [dataP]);
  const handleRefetch = () => {
    refetch();
    refetchP();
    refetchS();
  };
  if (isError || isErrorP || isErrorS) {
    return <Error onRetry={handleRefetch} />;
  }

  return (
    <Container>
      <CustomHeading text="Dashboard" fontSize={15} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl onRefresh={handleRefetch} refreshing={isReloading} />}>
        <DashBoardCards
          loading={isLoading}
          products={products}
          salesP={pharmacySales}
          salesS={storeSales}
        />
        {/* <ChartLoader loading={loading}>
          <Chart label="Expense" data={expense} />
        </ChartLoader> */}
        {isPending ? (
          <ProductLoader />
        ) : (
          <Products
            data={limitedProducts}
            text="Product list"
            linkText="View Product Page"
            href="/store"
          />
        )}
      </ScrollView>
    </Container>
  );
}
