/* eslint-disable prettier/prettier */
import type { IconProps } from '@tamagui/helpers-icon';
import { XStack } from 'tamagui';

import { CustomPressable } from './CustomPressable';
import { CustomSubHeading } from './typography';
import { CustomBarIcon } from '../TabBarIcon';

type Props = {
  text: string;
  text2?: string;
  action?: boolean;
  onPress?: () => void;
  icon?: React.NamedExoticComponent<IconProps>;
};

export const FlexText = ({ text, text2, icon: Icon, action, onPress }: Props): JSX.Element => {
  const handleClick = () => {
    onPress && onPress();
  };
  return (
    <XStack justifyContent="space-between" alignItems="center" marginTop="auto">
      <CustomSubHeading text={text} fontSize={1.4} />
      {text2 && <CustomSubHeading text={text2} fontSize={1.5} />}
      {action && (
        <CustomPressable onPress={handleClick} style={{ flex: 0 }}>
          <CustomBarIcon color="black" size={25} icon={Icon!} />
        </CustomPressable>
      )}
    </XStack>
  );
};
