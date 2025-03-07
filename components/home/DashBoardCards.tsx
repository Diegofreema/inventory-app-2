/* eslint-disable prettier/prettier */

import { ArrowBigDownDash, DollarSign, JapaneseYen, ShoppingBag } from '@tamagui/lucide-icons';
import { useMemo } from 'react';
import { FlatList, useWindowDimensions } from 'react-native';
import { Card, CardHeader, Circle, Stack, XStack } from 'tamagui';

import { CustomBarIcon } from '../TabBarIcon';
import { CustomSubHeading } from '../ui/typography';

import { colors } from '~/constants';
import OnlineSale from '~/db/model/OnlineSale';
import Product from '~/db/model/Product';
import StoreSales from '~/db/model/StoreSale';
import { useRender } from '~/hooks/useRender';
import { calculateTotalSales } from '~/lib/helper';
import { PreviewType } from '~/type';
import { CustomPressable } from '~/components/ui/CustomPressable';
import { Link, router } from 'expo-router';

type DashboardType = {
  products: Product[] | undefined;
  salesP: OnlineSale[];
  salesS: StoreSales[];
};
export const DashBoardCards = ({ products, salesP, salesS }: DashboardType): JSX.Element => {
  const { width } = useWindowDimensions();
  const mounted = useRender();
  const isSmallScreen = width < 411;
  const numColumns = isSmallScreen ? 1 : 2;
  const totalProducts = useMemo(() => products?.length, [products]);
  const lowProducts = useMemo(
    () => products?.filter((padding) => Number(padding.qty) <= 10),
    [products, mounted]
  );
  const totalSalesFromStore = useMemo(() => {
    return calculateTotalSales(salesS?.map((padding) => padding?.unitPrice));
  }, [salesS, mounted]);
  const totalSalesFrom247Pharm = useMemo(() => {
    return calculateTotalSales(salesP?.map((padding) => padding?.unitPrice));
  }, [salesP, mounted]);

  const data = [
    {
      title: 'Sales made from store',
      amount: `₦${Math.floor(totalSalesFromStore)}`,
    },
    {
      title: 'Sales made from 247Pharmacy',
      amount: `₦${Math.floor(totalSalesFrom247Pharm)}`,
    },
    {
      title: 'Total Products',
      amount: totalProducts,
    },
    {
      title: 'Low Stock',
      amount: lowProducts?.length || 0,
      link: '/lowStock',
    },
  ];

  return (
    <FlatList
      data={data}
      scrollEnabled={false}
      renderItem={({ item, index }) => (
        // @ts-ignore
        <DashBoardCard link={item?.link} title={item.title} amount={item.amount} index={index} />
      )}
      numColumns={numColumns}
      contentContainerStyle={{ gap: 10, padding: 5 }}
      columnWrapperStyle={isSmallScreen ? null : { gap: 10 }}
    />
  );
};

const DashBoardCard = ({ amount, title, index, link }: PreviewType & { index: number }) => {
  const colorArray = [
    { color1: '#1A5F7A', color2: '#86C8BC' }, // Deep blue and soft teal
    { color1: '#FF6B6B', color2: '#FFD93D' }, // Coral red and warm yellow
    { color1: '#4A4E69', color2: '#9A8C98' }, // Dark slate and muted lavender
    { color1: '#2A9D8F', color2: '#E9C46A' }, // Teal green and golden yellow
  ];
  const { width } = useWindowDimensions();
  const onPress = () => {
    if (link) {
      router.push(link);
    }
  };
  const isSmallScreen = width < 411;
  const IconArray = [DollarSign, JapaneseYen, ShoppingBag, ArrowBigDownDash];
  const Icon = IconArray[index];
  const color = colorArray[index];
  return link ? (
    <Link href={link} asChild style={{ flex: 1 }}>
      <Card
        flex={1}
        backgroundColor={colors.white}
        borderRadius={10}
        borderWidth={1}
        borderColor={colors.lightGray}
        width={isSmallScreen ? '100%' : '45%'}>
        <CardHeader>
          <XStack alignItems="center" justifyContent="space-between" gap={5}>
            <Stack>
              <CustomSubHeading
                maxWidth={isSmallScreen ? '100%' : '90%'}
                text={title!}
                fontSize={1.5}
                color={colors.grey}
              />
              <CustomSubHeading text={amount!} fontSize={2} color={colors.black} />
            </Stack>
            <Circle backgroundColor={color.color1} padding={5}>
              <CustomBarIcon icon={Icon} size={20} color={color.color2} />
            </Circle>
          </XStack>
        </CardHeader>
      </Card>
    </Link>
  ) : (
    <Card
      flex={1}
      backgroundColor={colors.white}
      borderRadius={10}
      borderWidth={1}
      borderColor={colors.lightGray}
      width={isSmallScreen ? '100%' : '45%'}>
      <CardHeader>
        <XStack alignItems="center" justifyContent="space-between" gap={5}>
          <Stack>
            <CustomSubHeading
              maxWidth={isSmallScreen ? '100%' : '90%'}
              text={title!}
              fontSize={1.5}
              color={colors.grey}
            />
            <CustomSubHeading text={amount!} fontSize={2} color={colors.black} />
          </Stack>
          <Circle backgroundColor={color.color1} padding={5}>
            <CustomBarIcon icon={Icon} size={20} color={color.color2} />
          </Circle>
        </XStack>
      </CardHeader>
    </Card>
  );
};
