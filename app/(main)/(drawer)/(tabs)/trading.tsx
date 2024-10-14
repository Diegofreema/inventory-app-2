/* eslint-disable prettier/prettier */

import { View } from 'tamagui';

import EnhancedTrading from '~/components/TradingComponent';

const TradingAccount = () => {
  return (
    <View flex={1} bg="white">
      <EnhancedTrading />
    </View>
  );
};

export default TradingAccount;
