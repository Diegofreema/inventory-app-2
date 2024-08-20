import { Calculator, Home, ListOrdered, ShoppingBag, ShoppingCart } from "@tamagui/lucide-icons";
import { Tabs } from 'expo-router';

import { CustomBarIcon } from '~/components/TabBarIcon';
import { colors } from '~/constants';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.green,
        tabBarLabelStyle: { fontSize: 10, fontFamily: 'InterBold' },
        tabBarInactiveTintColor: colors.gray,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <CustomBarIcon icon={Home} size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="store"
        options={{
          title: 'Store',
          tabBarIcon: ({ color, size }) => (
            <CustomBarIcon icon={ShoppingBag} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Report',
          tabBarIcon: ({ color, size }) => (
            <CustomBarIcon icon={ListOrdered} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: 'Sales',
          tabBarIcon: ({ color, size }) => (
            <CustomBarIcon icon={ShoppingCart} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trading"
        options={{
          title: 'Trading',
          tabBarIcon: ({ color, size }) => (
            <CustomBarIcon icon={Calculator} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
