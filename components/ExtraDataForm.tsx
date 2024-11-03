/* eslint-disable prettier/prettier */

import { Control, FieldErrors, UseFormSetValue } from 'react-hook-form';
import { View } from 'tamagui';
import { z } from 'zod';

import { CustomController } from './form/CustomController';

import { extraDataSchema } from '~/lib/validators';

type Props = {
  errors: FieldErrors<z.infer<typeof extraDataSchema>>;
  control: Control<z.infer<typeof extraDataSchema>>;
  setValue: UseFormSetValue<z.infer<typeof extraDataSchema>>;
  isCash: boolean
};

export const ExtraDataForm = ({ control, errors, setValue ,isCash}: Props): JSX.Element => {
  const data = [
    {
      value: 'Cash',
      label: 'Cash',
    },
    {
      value: 'Card',
      label: 'Card',
    },
    {
      value: 'Transfer',
      label: 'Transfer',
    },
  ];
  return (
    <View gap={10}>
      <CustomController
        control={control}
        errors={errors}
        label="Payment Type"
        name="paymentType"
        placeholder="Payment Type"
        variant="select"
        data={data}
        setValue={setValue}
        picker
      />
      {
     !isCash &&   <CustomController
          control={control}
          errors={errors}
          label="Card info"
          name="transferInfo"
          placeholder="Card info"
          variant="text"
        />
      }
    </View>
  );
};
