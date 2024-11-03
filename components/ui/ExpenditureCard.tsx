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
  const marginRight = index % 1 === 0 ? 15 : 0;
  return (
    <AnimatedCard index={index} style={{ marginBottom: 20, marginRight }}>
      <FlexText text="Account Name" text2={item} />
      <Separator marginVertical={5} />
      <FlexText text="Add Expenses" action icon={PlusCircle} onPress={handlePress} />
    </AnimatedCard>
  );
};
