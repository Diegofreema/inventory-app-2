/* eslint-disable prettier/prettier */

import { StyleProp, TextStyle } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
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
  fontSize = 4,
  color = colors.black,
  ...props
}: Props): JSX.Element => (
  <H1
    {...props}
    fontSize={RFPercentage(fontSize)}
    color={color}
    style={{ fontFamily: 'InterBold' }}>
    {text}
  </H1>
);
export const CustomSubHeading = ({
  text,
  fontSize = 1.5,
  color = colors.grey,
  style,
  ...props
}: Props): JSX.Element => (
  <Text
    {...props}
    fontSize={RFPercentage(fontSize)}
    color={color}
    style={[{ fontFamily: 'Inter' }, style]}>
    {text}
  </Text>
);
