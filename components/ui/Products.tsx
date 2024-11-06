/* eslint-disable prettier/prettier */

import { FlashList } from "@shopify/flash-list";
import { Href, Link, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useWindowDimensions } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { Card, CardFooter, CardHeader, Stack, Text, XStack } from "tamagui";

import { ActionMenu } from "./ActionMenu";
import { FlexText } from "./FlexText";
import { Empty } from "./empty";
import { CustomSubHeading } from "./typography";

import { MyButton } from "~/components/ui/MyButton";
import { colors } from "~/constants";
import Product from "~/db/model/Product";

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
    <FlashList
      onRefresh={onRefetch}
      refreshing={isLoading}
      ListHeaderComponent={() =>
        text ? <ProductHeader text={text} linkText={linkText} href={href} /> : null
      }
      scrollEnabled={scrollEnabled}
      data={data}
      renderItem={({ item, index }) => (
        <ProductCard nav={navigate} item={item} show={show} index={index} />
      )}
      contentContainerStyle={{
        paddingHorizontal: 5,
        paddingVertical: 15,
        paddingBottom: 25,
      }}
      ListEmptyComponent={() => <Empty text="No products in store" />}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      ListFooterComponent={Pagination}
      // columnWrapperStyle={isLargeScreen && { gap: 15 }}
      numColumns={isLargeScreen ? 2 : undefined}
      estimatedItemSize={500}
    />
  );
};

const ProductCard = ({
  item,
  show,
  nav,
  index,
}: {
  item: Product;
  show?: boolean;
  nav?: boolean;
  index: number;
}) => {
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

  const marginRight = index % 1 === 0 ? 15 : 0;
  return (
    <Card
      marginBottom={20}
      marginRight={isBigScreen ? marginRight : 0}
      backgroundColor="white"
      borderWidth={1}

      borderColor={colors.lightGray}>
      <CardHeader gap={10}>
        <XStack gap={14} alignItems="center">
          <CustomSubHeading text={item?.product} fontSize={1.4} numberOfLines={1} ellipse />
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
          <CustomSubHeading text="Actions" fontSize={1.4} />
          <ActionMenu visible={showMenu} onClose={onClose} onOpen={onOpen} details={details} />
        </XStack>
      </CardHeader>
      <CardFooter width='100%'>
        <MyButton title='View details' onPress={onPress} width='80%' height={50} mb={10} mx='auto' />
      </CardFooter>
    </Card>
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
    <XStack justifyContent="space-between" alignItems="center" mb={10}>
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
