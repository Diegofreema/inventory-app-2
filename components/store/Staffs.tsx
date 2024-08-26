/* eslint-disable prettier/prettier */
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList } from 'react-native';

import { StoreActions } from './StoreActions';
import { AnimatedCard } from '../ui/AnimatedCard';
import { AnimatedContainer } from '../ui/AniminatedContainer';
import { FlexText } from '../ui/FlexText';

import { StaffSelect } from '~/db/schema';
import { useDrizzle } from '~/hooks/useDrizzle';

export const Staffs = (): JSX.Element => {
  const { db, schema } = useDrizzle();
  const { data } = useLiveQuery(db.select().from(schema.staff));

  console.log(data);

  const [value, setValue] = useState('');
  const router = useRouter();
  const handleNav = useCallback(() => {
    router.push('/addStaff');
  }, []);
  return (
    <AnimatedContainer>
      <StoreActions
        setVal={setValue}
        val={value}
        onPress={handleNav}
        placeholder="By Staff Name"
        title="Staff"
      />
      <StaffsFlatList data={data} />
    </AnimatedContainer>
  );
};

const StaffsFlatList = ({ data }: { data: StaffSelect[] }) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => <StaffCard item={item} index={index} />}
    />
  );
};

const StaffCard = ({ index, item }: { item: StaffSelect; index: number }) => {
  return (
    <AnimatedCard index={index}>
      <FlexText text="Name" text2={item?.name} />
    </AnimatedCard>
  );
};
