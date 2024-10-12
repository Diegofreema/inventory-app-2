/* eslint-disable prettier/prettier */

import { withObservables } from '@nozbe/watermelondb/react';
import { ShoppingCart } from '@tamagui/lucide-icons';
import { StyleSheet } from 'react-native';
import { View } from 'tamagui';

import { CustomPressable } from './ui/CustomPressable';
import { CustomSubHeading } from './ui/typography';

import { colors } from '~/constants';
import { cartItems } from '~/db';

const CartButton = ({ qty, onPress }: { qty: number; onPress: () => void }) => {
  return (
    <CustomPressable onPress={onPress} style={styles.cart}>
      <View
        backgroundColor={colors.black}
        width={25}
        height={25}
        borderRadius={50}
        position="absolute"
        top={-2}
        right={0}
        justifyContent="center"
        alignItems="center">
        <CustomSubHeading text={qty} fontSize={1.5} color={colors.white} />
      </View>
      <ShoppingCart color={colors.white} size={30} />
    </CustomPressable>
  );
};

const enhanced = withObservables([], () => ({
  qty: cartItems.query().observeCount(),
}));

const EnhancedCartButton = enhanced(CartButton);

export default EnhancedCartButton;

const styles = StyleSheet.create({
  cart: {
    padding: 5,
    backgroundColor: colors.green,
    borderRadius: 50,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 50,
    right: 10,
  },
});
