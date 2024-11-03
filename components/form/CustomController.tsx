/* eslint-disable prettier/prettier */
import { Control, Controller, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { KeyboardTypeOptions } from 'react-native';
import { Text } from 'tamagui';

import { CustomInput } from './CustomInput';
import React from "react";

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
  data?: { value: any; label: string,quantity?: number }[];
  query?: string;
  setQuery?: React.Dispatch<React.SetStateAction<string>>;
  multiline?: boolean;
  autoFocus?: boolean;
  picker?: boolean;
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
  query,
  multiline,
  setQuery,
  autoFocus,
  picker
}: Props): JSX.Element => {
  return (
    // @ts-ignore
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
            query={query}
            setQuery={setQuery}
            multiline={multiline}
            autoFocus={autoFocus}
            picker={picker}
          />
        )}
      />
      {errors[name] && (
        <Text color="red" fontFamily="$body" fontSize={12} marginTop={5} marginLeft={5}>
          {errors?.[name]?.message}
        </Text>
      )}
    </>
  );
};
