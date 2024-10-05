/* eslint-disable prettier/prettier */
import { Eye, EyeOff } from '@tamagui/lucide-icons';
import { UseFormSetValue } from 'react-hook-form';
import { KeyboardTypeOptions, Pressable, TextInput, TextInputProps } from 'react-native';
import { Input, Text, XStack, YStack } from 'tamagui';

import { CustomSelect } from './CustomSelect';

import { colors } from '~/constants';

type Props = TextInputProps & {
  label: string;
  secure?: boolean;
  password?: boolean;
  handleSecure?: () => void;
  type?: KeyboardTypeOptions;
  variant?: 'text' | 'textarea' | 'select';
  data?: { value: string; label: string }[];
  setValue?: UseFormSetValue<any>;
  name: string;
  query?: string;
  setQuery?: React.Dispatch<React.SetStateAction<string>>;
};

export const CustomInput = ({
  label,
  secure,
  password,
  handleSecure,
  type = 'default',
  variant = 'text',
  data,
  setValue,
  name,
  query,
  setQuery,
  ...props
}: Props): JSX.Element => {
  const handleChange = (text: string) => {
    setValue && setValue(name, text);
  };

  return (
    <YStack gap={5}>
      <Text fontFamily="$body" color="black" fontSize={15}>
        {label}
      </Text>
      {variant === 'text' && (
        <XStack
          justifyContent="space-between"
          borderWidth={1}
          borderColor={colors.grey}
          height={60}
          alignItems="center"
          borderRadius={10}
          paddingRight={10}>
          <Input
            {...props}
            flex={1}
            placeholderTextColor="#999"
            color={colors.black}
            backgroundColor="transparent"
            keyboardType={type}
            style={{
              fontFamily: 'Inter',
              fontSize: 14,
            }}
            borderWidth={0}
            secureTextEntry={secure}
            autoCapitalize="none"
          />
          {password && (
            <Pressable
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
              onPress={handleSecure}>
              {secure ? <EyeOff color="black" size={25} /> : <Eye color="black" size={25} />}
            </Pressable>
          )}
        </XStack>
      )}
      {variant === 'textarea' && (
        <TextInput
          {...props}
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          style={{
            fontFamily: 'Inter',
            fontSize: 14,
            borderWidth: 1,
            borderColor: colors.grey,
            color: colors.black,
            backgroundColor: 'transparent',
            borderRadius: 10,
            padding: 10,
            textAlignVertical: 'top',
          }}
        />
      )}
      {variant === 'select' && (
        <CustomSelect
          {...props}
          data={data}
          placeholder={props.placeholder!}
          value={props.value}
          onValueChange={handleChange}
          query={query}
          setQuery={setQuery}
        />
      )}
    </YStack>
  );
};
