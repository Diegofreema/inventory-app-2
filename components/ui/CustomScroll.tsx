/* eslint-disable prettier/prettier */

import { KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'tamagui';

type Props = {
  children: React.ReactNode;
};

export const CustomScroll = ({ children }: Props): JSX.Element => {
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 60}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
      <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
    </KeyboardAvoidingView>
  );
};
