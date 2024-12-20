import { ChevronDown, X } from '@tamagui/lucide-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, StyleSheet, Alert } from 'react-native';
import { Input, View, XStack } from 'tamagui';

import { colors } from '~/constants';

type Props = {
  data?: { value: string; label: string; quantity: number }[];
  isOpen: boolean;
  onSelectItem: (item: { value: string; label: string }) => void;
  onClose: () => void;
};
export const SelectModal = ({ data, isOpen, onSelectItem, onClose }: Props) => {
  const [query, setQuery] = useState('');

  const filterData = data?.filter((d) => d.label.toLowerCase().includes(query.toLowerCase())) || [];
  const colorToRender = (quantity: number) => {
    return quantity >= 10
      ? colors.green
      : quantity < 1
        ? '#ccc'
        : quantity < 5
          ? 'red'
          : quantity < 10 ? '#FFD700'
            : 'black';
  };

  const onPress = (value: string, label: string, quantity: number) => {
    if (quantity < 1) {
      return Alert.alert(
        "Can't add out of stock product",
        'Please select a product in stock to sell'
      );
    }
    onSelectItem({ value, label });
    setQuery('');
  };
  return (
    <Modal animationType="slide" transparent={false} visible={isOpen}>
      <XStack alignItems="center">
        <View
          borderWidth={1}
          borderColor={colors.grey}
          borderRadius={7}
          height={55}
          marginHorizontal={10}
          flex={1}
          flexDirection="row"
          alignItems="center">
          <Input
            placeholder="Search product by name"
            value={query}
            onChangeText={setQuery}
            backgroundColor="transparent"
            color="black"
            borderWidth={0}
            flex={1}
          />
          {query && (
            <Pressable
              style={({ pressed }) => ({ padding: 5, opacity: pressed ? 0.5 : 1 })}
              onPress={() => setQuery('')}>
              <X color={colors.black} size={25} style={{ marginRight: 10 }} />
            </Pressable>
          )}
        </View>
        <Pressable
          style={({ pressed }) => [styles.cancel, { opacity: pressed ? 0.5 : 1 }]}
          onPress={onClose}>
          <ChevronDown color="black" size={30} />
        </Pressable>
      </XStack>
      <FlatList
        contentContainerStyle={{ flexGrow: 1, gap: 10, paddingHorizontal: 20, paddingVertical: 20 }}
        data={filterData}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            onPress={() => onPress(item.value, item.label, item.quantity!)}>
            <Text style={{ color: 'black', fontFamily: 'InterBold' }}>{item.label}</Text>
            <Text style={{ color: colorToRender(item?.quantity!), fontFamily: 'Inter' }}>
              {item.quantity} item(s) left in stock
            </Text>
          </Pressable>
        )}
        keyExtractor={(item) => item.value}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  cancel: {},
});
