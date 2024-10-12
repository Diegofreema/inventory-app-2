/* eslint-disable prettier/prettier */

import { KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'tamagui';

type Props = {
  children: React.ReactNode;
  scroll?: boolean;
};

export const CustomScroll = ({ children, scroll = false }: Props): JSX.Element => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={scroll}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 60}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        {children}
      </KeyboardAvoidingView>
    </ScrollView>
  );
};
