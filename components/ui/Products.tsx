/* eslint-disable prettier/prettier */

import { Href, Link, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, useWindowDimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Card, CardHeader, Stack, Text, XStack } from 'tamagui';

import { ActionMenu } from './ActionMenu';
import { CustomPressable } from './CustomPressable';
import { FlexText } from './FlexText';
import { Empty } from './empty';
import { CustomSubHeading } from './typography';
import { colors } from '../../constants';

import Product from '~/db/model/Product';

type Props = {
  data: Product[] | undefined;
  text?: string;
  href?: Href<string | object>;
  linkText?: string;
  show?: boolean;
  scrollEnabled?: boolean;
  isLoading?: boolean;
  onRefetch?: () => void;
  navigate?: boolean;
  pagination?: JSX.Element;
};

export const Products = ({
  data,
  text,
  href,
  linkText,
  show,
  scrollEnabled = false,
  isLoading,
  onRefetch,
  navigate,
  pagination: Pagination,
}: Props): JSX.Element => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 500;
  return (
    <FlatList
      onRefresh={onRefetch}
      refreshing={isLoading}
      ListHeaderComponent={() =>
        text ? <ProductHeader text={text} linkText={linkText} href={href} /> : null
      }
      scrollEnabled={scrollEnabled}
      data={data}
      renderItem={({ item }) => <ProductCard nav={navigate} item={item} show={show} />}
      contentContainerStyle={{
        gap: 15,
        flexGrow: 1,
        paddingHorizontal: 5,
        paddingVertical: 15,
        paddingBottom: 25,
        minHeight: 600,
      }}
      style={{ flex: 1, backgroundColor: 'transparent', marginTop: 10 }}
      ListEmptyComponent={() => <Empty text="No products in store" />}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      ListFooterComponent={Pagination}
      columnWrapperStyle={isLargeScreen && { gap: 15 }}
      numColumns={isLargeScreen ? 2 : undefined}
    />
  );
};

const ProductCard = ({ item, show, nav }: { item: Product; show?: boolean; nav?: boolean }) => {
  const [showMenu, setShowMenu] = useState(false);
  const isLow = +item?.qty <= 10;
  const router = useRouter();
  const onClose = useCallback(() => setShowMenu(false), []);
  const onOpen = useCallback(() => setShowMenu(true), []);

  const details = useMemo(
    () => ({
      productId: item?.productId,
      name: item?.product,
      price: item?.marketPrice,
      id: item?.id,
    }),
    [item?.id, item?.product, item?.marketPrice, item.productId]
  );
  const onPress = () => {
    if (!nav) return;
    router.push(`/product/${item.id}`);
  };
  const { width } = useWindowDimensions();

  const isSmaller = width <= 400;
  const isBigScreen = width >= 500;
  const cardHeight = isSmaller ? 150 : isBigScreen ? 250 : 200;
  return (
    <CustomPressable onPress={onPress}>
      <Card
        backgroundColor="white"
        borderWidth={1}
        height={show ? 'auto' : cardHeight}
        borderColor={colors.lightGray}>
        <CardHeader gap={10}>
          <XStack gap={14} alignItems="center">
            <CustomSubHeading text={item?.product} fontSize={1.9} />
          </XStack>
          <FlexText text="Category" text2={item?.category!} />
          <FlexText text={`Stock ${isLow ? '(low stock)' : ''}`} text2={item?.qty.toString()} />
          <FlexText text="Market price" text2={'₦' + item?.marketPrice} />
          {show && (
            <Stack gap={10}>
              <FlexText text="Dealer share" text2={'₦' + item?.shareDealer} />
              <FlexText text="Market price" text2={'₦' + item?.marketPrice} />

              <FlexText text="Subcategory" text2={item?.subcategory!} />
              <FlexText text="Online" text2={item?.online ? 'Yes' : 'No'} />
            </Stack>
          )}

          <XStack justifyContent="space-between" alignItems="center">
            <CustomSubHeading text="Actions" fontSize={1.7} />
            <ActionMenu visible={showMenu} onClose={onClose} onOpen={onOpen} details={details} />
          </XStack>
        </CardHeader>
      </Card>
    </CustomPressable>
  );
};

const ProductHeader = ({
  text,
  href,
  linkText,
}: {
  text: string;
  href?: Href<string | object>;
  linkText?: string;
}) => {
  return (
    <XStack justifyContent="space-between" alignItems="center">
      <CustomSubHeading text={text} fontSize={1.7} />
      {href && (
        <Link href={href}>
          <Text
            fontSize={RFPercentage(1.5)}
            color={colors.green}
            style={{ fontFamily: 'InterBold' }}>
            {linkText}
          </Text>
        </Link>
      )}
    </XStack>
  );
};
