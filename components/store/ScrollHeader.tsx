/* eslint-disable prettier/prettier */
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

import { CustomSubHeading } from '../ui/typography';

import { colors } from '~/constants';

type Props = {
  screens: string[];
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
};

export const ScrollHeader = ({ screens, active, setActive }: Props): JSX.Element => {
  const itemRef = useRef<TouchableOpacity[] | null>([]);
  const scrollRef = useRef<ScrollView>(null);

  const handleClick = (index: number) => {
    if (!itemRef?.current) return;
    const selectedItem = itemRef?.current[index];
    setActive(index);

    if (selectedItem) {
      selectedItem.measureLayout(
        scrollRef.current! as any,
        (x, y) => {
          scrollRef.current?.scrollTo({
            x: x - 16,
            y: 0,
            animated: true,
          });
        },
        () => {}
      );
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleTouchable = (index: number, el: TouchableOpacity) => {
    if (!itemRef?.current) return;
    itemRef.current[index] = el;
  };
  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        maxHeight: 40,
        borderBottomColor: colors.lightGray,
        borderBottomWidth: 2,
      }}
      contentContainerStyle={{
        gap: 20,
        paddingHorizontal: 16,
        marginVertical: 10,
        height: 30,
      }}>
      {screens?.map((screen, index) => (
        <TouchableOpacity
          onPress={() => handleClick(index)}
          ref={(el) => handleTouchable(index, el!)}
          key={index}
          style={{
            borderBottomWidth: active === index ? 3 : 0,
            borderBottomColor: colors.green,
          }}>
          <CustomSubHeading
            text={screen}
            fontSize={1.7}
            color={active === index ? colors.green : 'black'}
            style={{ fontFamily: 'InterBold' }}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
