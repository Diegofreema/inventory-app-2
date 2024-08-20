/* eslint-disable prettier/prettier */
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Button, ButtonProps, Spinner } from 'tamagui';

import { colors } from '~/constants';

type Props = ButtonProps & {
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  title: string;
  loading?: boolean;
  bg?: string;
  color?: string;
};

export const MyButton = ({
  containerStyle,
  buttonStyle,
  titleStyle,
  title,
  loading,
  bg = colors.green,
  color = '#fff',
  ...props
}: Props): JSX.Element => {
  const bgColor = props.disabled ? '#ccc' : bg;
  return (
    <Button {...props} bg={bgColor} color={color}>
      {loading ? <Spinner size="large" color="white" /> : title}
    </Button>
  );
};
