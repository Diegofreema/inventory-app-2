/* eslint-disable prettier/prettier */
import { Plus, Search, X } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button, Input, Stack, XStack } from 'tamagui';

import { CustomBarIcon } from '../TabBarIcon';
import { CustomPressable } from '../ui/CustomPressable';

import { colors } from '~/constants';
import { cats } from '~/data';

type Props = {
  placeholder?: string;
  title?: string;
  val?: string;
  setVal?: (value: string) => void;
  value?: string | null;
  setValue?: React.Dispatch<React.SetStateAction<string | null>>;
  show?: boolean;
  onPress?: () => void;
  date?: boolean;
  onOpenCalender?: () => void;
  dateValue?: string;
  resetDates?: () => void;
  hide?: boolean;
  showButton?: boolean;
};

export const StoreActions = ({
  placeholder,
  title,
  setVal,
  val,
  setValue,
  value,
  show,
  onPress,
  date,
  onOpenCalender,
  dateValue,
  resetDates,
  hide,
  showButton = true,
}: Props): JSX.Element => {
  const [open, setOpen] = useState(false);

  const [items, setItems] = useState(cats);

  const onFilter = () => {
    onOpenCalender && onOpenCalender();
  };
  const handleReset = () => {
    resetDates && resetDates();
  };
  return (
    <Stack marginTop={10} gap={10}>
      {!hide && (
        <XStack
          alignItems="center"
          borderWidth={1}
          borderColor={colors.lightGray}
          borderRadius={10}
          paddingHorizontal={5}>
          <CustomBarIcon color="black" size={20} icon={Search} />
          <Input
            placeholder={`Search ${placeholder}`}
            backgroundColor="$colorTransparent"
            borderWidth={0}
            fontSize={15}
            style={{ fontFamily: 'InterBold', color: 'black' }}
            flex={1}
            value={val}
            onChangeText={setVal}
          />
        </XStack>
      )}
      <XStack>
        {date && (
          <XStack
            alignItems="center"
            borderWidth={1}
            borderColor={colors.lightGray}
            borderRadius={10}
            flex={1}>
            <CustomPressable onPress={onFilter} style={{ height: 50, flex: 1 }}>
              <Input
                editable={false}
                backgroundColor="$colorTransparent"
                borderWidth={0}
                fontSize={15}
                style={{ fontFamily: 'InterBold', color: 'black' }}
                placeholder="(07/25/2015 to 12/25/2015)"
                placeholderTextColor={colors.lightGray}
                height={50}
                flex={1}
                value={dateValue}
              />
            </CustomPressable>
            {dateValue && (
              <CustomPressable onPress={handleReset} style={{ flex: 0, marginRight: 10 }}>
                <X color="black" size={25} />
              </CustomPressable>
            )}
          </XStack>
        )}
      </XStack>
      <XStack gap={5} alignItems="center" justifyContent={show ? 'center' : 'flex-end'}>
        {show && (
          <DropDownPicker
            open={open}
            value={value!}
            items={items}
            setOpen={setOpen}
            setValue={setValue!}
            setItems={setItems}
            containerStyle={{ width: '50%', height: 50 }}
            labelStyle={{ fontFamily: 'Inter' }}
            placeholderStyle={{ fontFamily: 'Inter' }}
            placeholder="Category"
            listChildLabelStyle={{ fontFamily: 'Inter' }}
          />
        )}

        {showButton && (
          <Button
            backgroundColor={colors.green}
            alignSelf="flex-end"
            height={50}
            flex={1}
            onPress={onPress}
            icon={<Plus size={20} />}>
            {`Add ${title}`}
          </Button>
        )}
      </XStack>
    </Stack>
  );
};
