/* eslint-disable prettier/prettier */

import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { useMemo } from 'react';
import type { FontSizeTokens, SelectProps } from 'tamagui';
import { Adapt, Input, Select, Sheet, View, YStack, getFontSize } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

type Props = SelectProps & {
  placeholder: string;
  data?: { value: string; label: string }[];
  onValueChange?(value: string): void;
  value?: string | undefined;
  query?: string;
  setQuery?: React.Dispatch<React.SetStateAction<string>>;
};
export const CustomSelect = ({
  placeholder,
  data,
  onValueChange,
  value,
  setQuery,
  query,
  ...props
}: Props) => {
  return (
    // @ts-ignore
    <>
      <Select value={value} onValueChange={onValueChange} disablePreventBodyScroll {...props}>
        <Select.Trigger
          width="100%"
          iconAfter={<ChevronDown color="black" size={25} />}
          height={60}
          backgroundColor="$colorTransparent">
          <Select.Value placeholder={placeholder} color="black" />
        </Select.Trigger>

        {/* @ts-ignore */}
        <Adapt platform="touch">
          <Sheet
            native={!!props.native}
            modal
            dismissOnSnapToBottom
            animationConfig={{
              type: 'spring',
              damping: 20,
              mass: 1.2,
              stiffness: 250,
            }}>
            <Sheet.Frame backgroundColor="white">
              <Sheet.ScrollView
                backgroundColor="white"
                style={{ backgroundColor: 'white' }}
                contentContainerStyle={{ backgroundColor: 'white' }}>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              backgroundColor="white"
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3">
            <YStack zIndex={10}>
              <ChevronUp size={20} color="black" />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['$background', 'transparent']}
              borderRadius="$4"
            />
          </Select.ScrollUpButton>

          <Select.Viewport
            // to do animations:
            animation="quick"
            animateOnly={['transform', 'opacity']}
            enterStyle={{ x: 0, y: -10 }}
            exitStyle={{ x: 0, y: 10 }}
            minWidth={200}>
            <Select.Group backgroundColor="white">
              {setQuery ? (
                <View marginHorizontal={10}>
                  <Input
                    placeholder="Search product by name"
                    value={query}
                    onChangeText={setQuery}
                  />
                </View>
              ) : (
                <Select.Label
                  color="black"
                  backgroundColor="white"
                  borderBottomColor="black"
                  borderBottomWidth={2}>
                  {placeholder}
                </Select.Label>
              )}

              {/* for longer lists memoizing these is useful */}
              {useMemo(
                () =>
                  data?.map((item, i) => {
                    return (
                      <Select.Item backgroundColor="white" index={i} key={i} value={item?.value}>
                        <Select.ItemText color="black">{item?.label}</Select.ItemText>
                        <Select.ItemIndicator marginLeft="auto">
                          <Check size={16} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    );
                  }),
                [data]
              )}
            </Select.Group>
            {/* Native gets an extra icon */}
            {props.native && (
              <YStack
                position="absolute"
                right={0}
                top={0}
                bottom={0}
                alignItems="center"
                justifyContent="center"
                width="$4"
                pointerEvents="none">
                <ChevronDown size={getFontSize((props.size as FontSizeTokens) ?? '$true')} />
              </YStack>
            )}
          </Select.Viewport>

          <Select.ScrollDownButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3">
            <YStack zIndex={10}>
              <ChevronDown size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['transparent', '$background']}
              borderRadius="$4"
            />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    </>
  );
};
