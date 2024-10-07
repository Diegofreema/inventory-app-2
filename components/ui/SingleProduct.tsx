/* eslint-disable prettier/prettier */

import { withObservables } from '@nozbe/watermelondb/react';
import { useCallback, useMemo, useState } from 'react';
import { Card, CardHeader, Stack, XStack } from 'tamagui';

import { ActionMenu } from './ActionMenu';
import { FlexText } from './FlexText';
import { CustomSubHeading } from './typography';

import { colors } from '~/constants';
import database, { products } from '~/db';
import Product from '~/db/model/Product';
import { useEdit } from '~/lib/tanstack/mutations';
import { useInfo } from '~/lib/tanstack/queries';

const SingleProduct = ({ product }: { product: Product }): JSX.Element => {
  const [showMenu, setShowMenu] = useState(false);
  const { mutateAsync, isPending } = useEdit();
  const { data } = useInfo();
  const isLow = product?.qty <= 10;
  console.log({ id: product.id });

  const onClose = useCallback(() => setShowMenu(false), []);
  const onOpen = useCallback(() => setShowMenu(true), []);

  const details = useMemo(
    () => ({
      id: product?.id,
      name: product?.product,
      price: product?.sellingPrice!,
      productId: product?.productId,
    }),
    [product?.id, product?.product, product?.sellingPrice, product?.productId]
  );

  const toggleOnline = async () => {
    const pd = await products.find(product.id);
    mutateAsync({
      customerProductId: product.customerProductId,
      online: product.online ? '0' : '1',
      price: product.marketPrice.toString(),
      productId: product.productId,
      qty: product.qty.toString(),
      sellingPrice: product.sellingPrice.toString(),
      dealerShare: data?.[0].shareSeller!,
      netProShare: data?.[0].shareNetpro!,
    });

    await database.write(async () => {
      await pd.update((p) => {
        p.online = !p.online;
      });
    });
  };

  return (
    <Card backgroundColor="white" borderWidth={1} borderColor={colors.lightGray}>
      <CardHeader gap={10}>
        <XStack gap={14} alignItems="center">
          <CustomSubHeading text={product?.product} fontSize={17} />
        </XStack>
        <FlexText text="Category" text2={product?.category!} />
        <FlexText text={`Stock ${isLow ? '(low stock)' : ''}`} text2={product?.qty.toString()} />
        <FlexText text="Unit price" text2={'₦' + product?.sellingPrice} />

        <Stack gap={10}>
          <FlexText text="Dealer share" text2={'₦' + product?.shareDealer} />
          <FlexText text="Market price" text2={'₦' + product?.marketPrice} />

          <FlexText text="Subcategory" text2={product?.subcategory!} />
          <FlexText text="Online" text2={product?.online ? 'Yes' : 'No'} />
        </Stack>

        <XStack justifyContent="space-between" alignItems="center">
          <CustomSubHeading text="Actions" fontSize={15} />
          <ActionMenu
            visible={showMenu}
            onClose={onClose}
            onOpen={onOpen}
            details={details}
            online={product.online}
            toggleOnline={toggleOnline}
            disabled={isPending}
          />
        </XStack>
      </CardHeader>
    </Card>
  );
};

const enhanced = withObservables(['productId'], ({ productId }) => ({
  product: products.findAndObserve(productId),
}));

export default enhanced(SingleProduct);
