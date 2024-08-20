/* eslint-disable prettier/prettier */

import { Stack } from 'tamagui';

import { CustomHeading } from './typography';

type Props = {
  text: string;
};

export const Empty = ({ text }: Props): JSX.Element => {
  return (
    <Stack>
      <CustomHeading text={text} textAlign="center" fontSize={20} />
    </Stack>
  );
};
