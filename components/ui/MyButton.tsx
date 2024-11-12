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


  return (
    <Button
      {...props}
      backgroundColor={bgColor}
      color={color}
      fontSize={RFPercentage(1.8)}
      fontWeight="bold">
      {loading ? <Spinner size="large" color="white" /> : title}
    </Button>
  );
};
