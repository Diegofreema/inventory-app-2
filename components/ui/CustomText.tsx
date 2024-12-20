import { Text } from 'react-native';

type Props = {
  text: string;
  fontSize?: number;
  color?: string;
  fontFamily?: 'Inter' | 'InterBold';
};
export const CustomText = ({
  text,
  fontSize = 15,
  fontFamily = 'Inter',
  color = 'white',
}: Props) => {
  return <Text style={{ fontFamily, fontSize, color }}>{text}</Text>;
};
