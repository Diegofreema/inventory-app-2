import { CircleEllipsis } from '@tamagui/lucide-icons';
import { Text } from 'react-native';
import * as DropdownMenu from 'zeego/dropdown-menu';

import { CustomBarIcon } from '~/components/TabBarIcon';
import { MenuProps } from '~/type';

export const Menus = ({ onSelect, items }: MenuProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <CustomBarIcon size={25} color="black" icon={CircleEllipsis} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Group>
          {items.map((item) => (
            <DropdownMenu.Item
              key={item.key}
              textValue={item.title}
              onSelect={() => onSelect(item.key)}>
              <DropdownMenu.ItemIcon
                ios={{
                  name: item.icon,
                  pointSize: 18,
                }}
                androidIconName={item.iconAndroid}
              />
              <DropdownMenu.ItemTitle>
                <Text style={{ fontFamily: 'Inter' }}>{item.title}</Text>
              </DropdownMenu.ItemTitle>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Group>

        <DropdownMenu.Arrow />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
