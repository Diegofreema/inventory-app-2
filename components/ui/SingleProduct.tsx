/* eslint-disable prettier/prettier */

import { withObservables } from "@nozbe/watermelondb/react";
import { useRouter } from "expo-router";
import { useWindowDimensions } from "react-native";
import { Card, CardHeader, Stack, XStack } from "tamagui";

import { FlexText } from "./FlexText";
import { CustomSubHeading } from "./typography";

import { Menus } from "~/components/Menu";
import { colors } from "~/constants";
import database, { products } from "~/db";
import Product from "~/db/model/Product";
import { useEdit } from "~/lib/tanstack/mutations";
import { useInfo } from "~/lib/tanstack/queries";
import { ItemType } from "~/type";

const SingleProduct = ({ product }: { product: Product }): JSX.Element => {
const router = useRouter();
  const items: ItemType[] = [
    { key: 'restock', title: 'Restock item', icon: 'rotate.3d.circle', iconAndroid: 'ic_menu_rotate' },
    { key: 'update_price', title: 'Update Price', icon: 'plus', iconAndroid: 'ic_input_add' },
    {
      key: 'update_quantity',
      title: 'Update Quantity',
      icon: 'plusminus.circle.fill',
      iconAndroid: 'ic_menu_add',
    },
    { key: 'dispose', title: 'Dispose item', icon: 'trash', iconAndroid: 'ic_menu_delete' },
    { key: 'toggle', title: product.online ? 'Set offline' : 'Set online', icon: product.online ? 'poweron' : 'poweroff', iconAndroid: product.online ? 'presence_online' : 'presence_offline' },
  ];
  const { mutateAsync, isPending } = useEdit();
  const { width } = useWindowDimensions();
  const { data } = useInfo();
  const isLow = product?.qty <= 10;



  const handleDispose = () => {
    router.push(`/dispose?productId=${product?.productId}&name=${product?.product}&id=${product?.id}`);
  };

  const handleSupply = () => {
    router.push(
      `/restock?productId=${product?.productId}&name=${product?.product}&price=${product?.marketPrice}&id=${product?.id}`
    );
  };

  const handleUpdatePrice = () => {
    router.push(`/update-price?name=${product?.product}&id=${product?.id}`);
  };
  const handleUpdateQuantity = () => {
    router.push(`/update-quantity?name=${product?.product}&id=${product?.id}`);
  };

  console.log(product.productId);

  const toggleOnline = async () => {
    if(isPending) return;
    const pd = await products.find(product.id);
    await database.write(async () => {
      await pd.update((p) => {
        p.online = !p.online;
      });
    });
   try {
     await mutateAsync({
       customerProductId: product.customerProductId,
       online: product.online,
       price: product.marketPrice.toString(),
       productId: product.productId,
       qty: product.qty.toString(),
       sellingPrice: product.sellingPrice.toString(),
       dealerShare: data?.[0].shareSeller!,
       netProShare: data?.[0].shareNetpro!,
     });
   }catch (e){
     console.log(e, 'error');
   }


  };
  const isBigScreen = width >= 500;

  const isSmallTablet = width >= 500;
  const isBigTablet = width >= 700;
  const containerWidth = isSmallTablet ? '80%' : isBigTablet ? '60%' : '100%';

  const onSelect = async (key: string) => {
    switch (key) {
      case 'restock':
        handleSupply();
        break;
      case 'update_quantity':
        handleUpdateQuantity();
        break;
      case 'dispose':
        handleDispose();
        break;
      case 'update_price':
        handleUpdatePrice();
        break;
      case 'toggle':
       await toggleOnline();
       break;
      default:
        break;
    }
  };
  return (
    <Card
      backgroundColor="white"
      borderWidth={1}
      mt={isBigScreen ? 30 : 10}
      borderColor={colors.lightGray}
      width={containerWidth}
      mx="auto">
      <CardHeader gap={10}>
        <XStack gap={14} alignItems="center">
          <CustomSubHeading text={product?.product} fontSize={1.9} />
        </XStack>

        <FlexText text="Category" text2={product?.category!} />
        <FlexText text={`Stock ${isLow ? '(low stock)' : ''}`} text2={product?.qty.toString()} />
        <FlexText text="Market price" text2={'₦' + product?.marketPrice} />

        <Stack gap={10}>
          <FlexText text="Platform price" text2={'₦' + product?.sellingPrice} />
          <FlexText text="Dealer share" text2={'₦' + product?.shareDealer} />

          <FlexText text="Subcategory" text2={product?.subcategory!} />
          <FlexText text="Online" text2={product?.online ? 'Yes' : 'No'} />
        </Stack>

        <XStack justifyContent="space-between" alignItems="center">
          <CustomSubHeading text="Actions" fontSize={1.7} />
          {/*<ActionMenu*/}
          {/*  visible={showMenu}*/}
          {/*  onClose={onClose}*/}
          {/*  onOpen={onOpen}*/}
          {/*  details={details}*/}
          {/*  online={product.online}*/}
          {/*  toggleOnline={toggleOnline}*/}
          {/*  disabled={isPending}*/}
          {/*/>*/}
          <Menus items={items} onSelect={onSelect} />
        </XStack>
      </CardHeader>
    </Card>
  );
};

const enhanced = withObservables(['productId'], ({ productId }) => ({
  product: products.findAndObserve(productId),
}));

export default enhanced(SingleProduct);
