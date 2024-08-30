/* eslint-disable prettier/prettier */

import { ArrowBigDownDash, DollarSign, JapaneseYen, ShoppingBag } from '@tamagui/lucide-icons';
import { useMemo } from 'react';
import { FlatList, useWindowDimensions } from 'react-native';
import { Card, CardHeader, Circle, Stack, XStack } from 'tamagui';

import { CustomBarIcon } from '../TabBarIcon';
import { CustomSubHeading } from '../ui/typography';

import { colors } from '~/constants';
import { ProductSelect, SalesP, SalesS } from '~/db/schema';
import { calculateTotalSales } from '~/lib/helper';
import { PreviewType } from '~/type';

type DashboardType = {
  products: ProductSelect[] | undefined;
  salesP: SalesP[];
  salesS: SalesS[];
};
export const DashBoardCards = ({ products, salesP, salesS }: DashboardType): JSX.Element => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 411;
  const numColumns = isSmallScreen ? 1 : 2;
  const totalProducts = useMemo(() => products?.length, [products]);
  const lowProducts = useMemo(() => products?.filter((p) => Number(p.qty) <= 10), [products]);
  const totalSalesFromStore = useMemo(() => {
    return calculateTotalSales(salesS?.map((p) => p?.unitPrice));
  }, [salesS]);
  const totalSalesFrom247Pharm = useMemo(() => {
    return calculateTotalSales(salesP?.map((p) => p?.unitPrice));
  }, [salesP]);

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
    },
  ];

  return (
    <FlatList
      data={data}
      scrollEnabled={false}
      renderItem={({ item, index }) => <DashBoardCard {...item} index={index} />}
      numColumns={numColumns}
      contentContainerStyle={{ gap: 10, padding: 5 }}
      columnWrapperStyle={isSmallScreen ? null : { gap: 10 }}
    />
  );
};

const DashBoardCard = ({ amount, title, index }: PreviewType & { index: number }) => {
  const colorArray = [
    { color1: '#1A5F7A', color2: '#86C8BC' }, // Deep blue and soft teal
    { color1: '#FF6B6B', color2: '#FFD93D' }, // Coral red and warm yellow
    { color1: '#4A4E69', color2: '#9A8C98' }, // Dark slate and muted lavender
    { color1: '#2A9D8F', color2: '#E9C46A' }, // Teal green and golden yellow
  ];
  const { width } = useWindowDimensions();

  const isSmallScreen = width < 411;
  const IconArray = [DollarSign, JapaneseYen, ShoppingBag, ArrowBigDownDash];
  const Icon = IconArray[index];
  const color = colorArray[index];
  return (
    <Card
      flex={1}
      bg={colors.white}
      borderRadius={10}
      borderWidth={1}
      borderColor={colors.lightGray}
      width={isSmallScreen ? '100%' : '45%'}
      backgroundColor={colors.white}>
      <CardHeader>
        <XStack alignItems="center" justifyContent="space-between" gap={5}>
          <Stack>
            <CustomSubHeading
              maxWidth={isSmallScreen ? '100%' : '90%'}
              text={title!}
              fontSize={12}
              color={colors.grey}
            />
            <CustomSubHeading text={amount!} fontSize={18} color={colors.black} />
          </Stack>
          <Circle bg={color.color1} p={5}>
            <CustomBarIcon icon={Icon} size={20} color={color.color2} />
          </Circle>
        </XStack>
      </CardHeader>
    </Card>
  );
};
