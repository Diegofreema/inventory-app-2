/* eslint-disable prettier/prettier */

import { Href, Link, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { Card, CardHeader, Stack, Text, XStack } from 'tamagui';

import { ActionMenu } from './ActionMenu';
import { CustomPressable } from './CustomPressable';
import { FlexText } from './FlexText';
import { Empty } from './empty';
import { CustomSubHeading } from './typography';
import { colors } from '../../constants';

import { ProductSelect } from '~/db/schema';

type Props = {
  data: ProductSelect[] | undefined;
  text?: string;
  href?: Href<string | object>;
  linkText?: string;
  show?: boolean;
  scrollEnabled?: boolean;
  isLoading?: boolean;
  onRefetch?: () => void;
  navigate?: boolean;
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
}: Props): JSX.Element => {
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
      contentContainerStyle={{ gap: 15, flexGrow: 1, paddingHorizontal: 5, paddingVertical: 15 }}
      style={{ flex: 1, backgroundColor: 'transparent', marginTop: 10 }}
      ListEmptyComponent={() => <Empty text="No products in store" />}
      showsVerticalScrollIndicator={false}
    />
  );
};

const ProductCard = ({
  item,
  show,
  nav,
}: {
  item: ProductSelect;
  show?: boolean;
  nav?: boolean;
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const isLow = +item?.qty <= 10;
  const router = useRouter();
  const onClose = useCallback(() => setShowMenu(false), []);
  const onOpen = useCallback(() => setShowMenu(true), []);

  const details = useMemo(
    () => ({
      productId: item?.id,
      name: item?.product,

      price: item?.sellingprice!,
    }),
    []
  );
  const onPress = () => {
    if (!nav) return;
    router.push(`/product/${item.id}`);
  };
  return (
    <CustomPressable onPress={onPress}>
      <Card bg="white" borderWidth={1} height={show ? 'auto' : 200} borderColor={colors.lightGray}>
        <CardHeader gap={10}>
          <XStack gap={14} alignItems="center">
            <CustomSubHeading text={item?.product} fontSize={17} />
          </XStack>
          <FlexText text="Category" text2={item?.category!} />
          <FlexText text={`Stock ${isLow ? '(low stock)' : ''}`} text2={item?.qty} />
          <FlexText text="Unit price" text2={'₦' + item?.sellingprice} />
          {show && (
            <Stack gap={10}>
              <FlexText text="NetPro share" text2={'₦' + item?.sharenetpro} />
              <FlexText text="Dealer share" text2={'₦' + item?.sharedealer} />
              <FlexText text="Market price" text2={'₦' + item?.marketprice} />
              <FlexText text="Category" text2={item?.category!} />
              <FlexText text="Subcategory" text2={item?.category!} />
              <FlexText text="Online" text2={item?.online === 'True' ? 'Yes' : 'No'} />
            </Stack>
          )}

          <XStack justifyContent="space-between" alignItems="center">
            <CustomSubHeading text="Actions" fontSize={15} />
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
      <CustomSubHeading text={text} fontSize={17} />
      {href && (
        <Link href={href}>
          <Text fontSize={12} color={colors.green} style={{ fontFamily: 'InterBold' }}>
            {linkText}
          </Text>
        </Link>
      )}
    </XStack>
  );
};
