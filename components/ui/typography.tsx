/* eslint-disable prettier/prettier */

import { StyleProp, TextStyle } from 'react-native';
import { H1, Text, TextProps } from 'tamagui';

import { colors } from '~/constants';

type Props = TextProps & {
  text: any;
  fontSize?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export const CustomHeading = ({
  text,
  fontSize = 33,
  color = colors.black,
  ...props
}: Props): JSX.Element => (
  <H1 {...props} fontSize={fontSize} color={color} style={{ fontFamily: 'InterBold' }}>
    {text}
  </H1>
);
export const CustomSubHeading = ({
  text,
  fontSize = 13,
  color = colors.grey,
  style,
  ...props
}: Props): JSX.Element => (
  <Text {...props} fontSize={fontSize} color={color} style={[{ fontFamily: 'Inter' }, style]}>
    {text}
  </Text>
);
