/* eslint-disable prettier/prettier */

import { PlusCircle } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';
import { Separator } from 'tamagui';

import { AnimatedCard } from './AnimatedCard';
import { FlexText } from './FlexText';

type Props = {
  item: string;
  index: number;
};

export const ExpenditureCard = ({ item, index }: Props): JSX.Element => {
  const router = useRouter();
  const handlePress = () => {
    router.push(`/addExpense?name=${item}`);
  };

  return (
    <AnimatedCard index={index}>
      <FlexText text="Account Name" text2={item} />
      <Separator my={5} />
      <FlexText text="Add Expenses" action icon={PlusCircle} onPress={handlePress} />
    </AnimatedCard>
  );
};
