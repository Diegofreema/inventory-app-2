/* eslint-disable prettier/prettier */
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Button, ButtonProps, Spinner } from 'tamagui';

import { colors } from '~/constants';

type Props = ButtonProps & {
  containerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  title: string;
  loading?: boolean;
  backgroundColor?: string;
  color?: string;
};

export const MyButton = ({
  containerStyle,
  buttonStyle,
  titleStyle,
  title,
  loading,
  backgroundColor = colors.green,
  color = '#fff',
  ...props
}: Props): JSX.Element => {
  const bgColor = props.disabled ? '#ccc' : backgroundColor;
  console.log(loading);

  return (
    <Button
      {...props}
      backgroundColor={bgColor}
      color={color}
      fontSize={RFPercentage(1.5)}
      fontWeight="bold">
      {loading ? <Spinner size="large" color="white" /> : title}
    </Button>
  );
};
