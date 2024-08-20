/* eslint-disable prettier/prettier */

import DropDownPicker from 'react-native-dropdown-picker';
import { Text, View } from 'tamagui';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  setItems: React.Dispatch<
    React.SetStateAction<
      {
        label: string;
        value: string;
      }[]
    >
  >;
  items: {
    label: string;
    value: string;
  }[];
  label: string;
};

export const CustomDropdown = ({
  open,
  setOpen,
  setValue,
  value,
  items,
  setItems,
  label,
}: Props): JSX.Element => {
  return (
    <View gap={5}>
      <Text fontFamily="$body" color="black" fontSize={15}>
        {label}
      </Text>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        labelStyle={{ fontFamily: 'Inter' }}
        placeholderStyle={{ fontFamily: 'Inter' }}
        placeholder={label}
        listChildLabelStyle={{ fontFamily: 'Inter' }}
        flatListProps={{ scrollEnabled: false }}
        dropDownContainerStyle={{ zIndex: 2, height: 500 }}
        containerStyle={{ zIndex: 1 }}
        dropDownDirection="TOP"
      />
    </View>
  );
};
