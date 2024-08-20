import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { IconProps } from '@tamagui/helpers-icon';
import { StyleSheet } from 'react-native';
export const TabBarIcon = (props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) => {
  return <FontAwesome size={28} style={styles.tabBarIcon} {...props} />;
};

export const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -3,
  },
});

type IconType = {
  icon: React.NamedExoticComponent<IconProps>;
  color: string;
  size: number;
};

export const CustomBarIcon = ({ icon: Icon, color, size }: IconType) => (
  <Icon color={color} size={size} />
);
