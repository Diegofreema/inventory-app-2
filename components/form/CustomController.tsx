/* eslint-disable prettier/prettier */
import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { KeyboardTypeOptions } from 'react-native';
import { Text } from 'tamagui';

import { CustomInput } from './CustomInput';

type Props = {
  errors: FieldErrors<any>;
  control: Control<any>;
  setValue?: UseFormSetValue<any>;
  name: any;
  placeholder: string;
  label: string;
  editable?: boolean;
  secure?: boolean;
  password?: boolean;
  handleSecure?: () => void;
  type?: KeyboardTypeOptions;
  variant?: 'text' | 'textarea' | 'select';
  data?: { value: string; label: string }[];
};

export const CustomController = ({
  control,
  errors,
  name,
  label,
  placeholder,
  editable,
  handleSecure,
  password,
  secure,
  type,
  variant,
  data,
  setValue,
}: Props): JSX.Element => {
  return (
    <>
      <Controller
        control={control}
        name={name}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value } }) => (
          <CustomInput
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            label={label}
            placeholder={placeholder}
            editable={editable}
            secure={secure}
            password={password}
            handleSecure={handleSecure}
            type={type}
            variant={variant}
            data={data}
            setValue={setValue}
            name={name}
          />
        )}
      />
      {errors[name] && (
        <Text color="red" fontFamily="$body" fontSize={12} mt={5} ml={5}>
          {errors?.[name]?.message}
        </Text>
      )}
    </>
  );
};
