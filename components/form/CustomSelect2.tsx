import { Picker } from '@react-native-picker/picker';
import { ChevronDown } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { View, YStack } from 'tamagui';
import RNPickerSelect from 'react-native-picker-select';

import { SelectModal } from '~/components/modals/SelectModal';
import { CustomSubHeading } from '~/components/ui/typography';
import { colors } from '~/constants';

type Props = {
  data?: { value: string; label: string; quantity?: number }[];
  onValueChange(value: string): void;
  value?: string | undefined;
  placeholder?: string;
  name: string;
};
export const CustomSelect2 = ({ data, onValueChange, value, placeholder }: Props) => {
  return (
    <YStack>
      <CustomSubHeading text={placeholder} />
      <View borderColor={colors.grey} borderWidth={1} borderRadius={10} height={60} width="100%">
        <RNPickerSelect
          onValueChange={(value) => onValueChange(value)}
          items={data!}
          value={value}
          style={{ placeholder: { fontFamily: 'Inter' } }}

        />
      </View>
    </YStack>
  );
};

type ModalType = {
  data?: { value: string; label: string; quantity: number }[];
  onValueChange(value: string): void;
  selectedValue: { value: string; label: string } | null;
  setSelectedValue: React.Dispatch<React.SetStateAction<{ label: string; value: string } | null>>;
};

export const MyCustomInput = ({
  data,
  onValueChange,
  selectedValue,
  setSelectedValue,
}: ModalType) => {
  const [isOpen, setIsOpen] = useState(false);
  const onSelectItem = (item: { value: string; label: string }) => {
    setSelectedValue(item);
    onValueChange(item.value);
    setIsOpen(false);
  };
  const onCLose = () => setIsOpen(false);
  return (
    <>
      <Pressable
        onPress={() => setIsOpen((prev) => !prev)}
        style={({ pressed }) => [styles.pressable, { opacity: pressed ? 0.5 : 1 }]}>
        <Text style={[styles.text, { color: selectedValue?.label ? 'black' : 'gray' }]}>
          {selectedValue?.label || 'Select an item'}
        </Text>
        <ChevronDown color="black" />
      </Pressable>
      <SelectModal onClose={onCLose} onSelectItem={onSelectItem} isOpen={isOpen} data={data} />
    </>
  );
};
const styles = StyleSheet.create({
  pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 10,
    height: 60,
    paddingHorizontal: 10,
    gap: 3,
  },
  text: {
    fontSize: 15,
    color: 'gray',
    flex: 1,
    fontFamily: 'Inter',
  },
  abs: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'green',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
});
