import { MaterialIcons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';

import { DrawerHeader } from '~/components/ui/DrawerHeader';
const DrawerLayout = () => {
  return (
    <Drawer
      screenOptions={{
        header: () => <DrawerHeader />,
        drawerType: 'slide',
      }}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          headerTitle: 'Tabs',
          drawerLabel: 'Tabs',
          drawerIcon: ({ size, color }) => (
            <MaterialIcons name="border-bottom" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
