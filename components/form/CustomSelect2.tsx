import { Picker } from '@react-native-picker/picker';
import { View, YStack } from 'tamagui';

import { CustomSubHeading } from '~/components/ui/typography';

type Props = {
  data?: { value: string; label: string }[];
  onValueChange(value: string): void;
  value?: string | undefined;
  placeholder?: string;
  name: string;
};
export const CustomSelect2 = ({ data, onValueChange, value, placeholder }: Props) => {
  return (
    <YStack>
      <CustomSubHeading text={placeholder} />
      <View borderColor="black" borderWidth={1} borderRadius={10} height={50} width="100%">
        <Picker
          mode="dropdown"
          style={{ borderWidth: 1, borderColor: 'black' }}
          selectedValue={value}
          onValueChange={(itemValue) => onValueChange(itemValue)}>
          {data?.map((item) => (
            <Picker.Item key={item.label} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </YStack>
  );
};
