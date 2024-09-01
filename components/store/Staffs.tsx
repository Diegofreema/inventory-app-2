/* eslint-disable prettier/prettier */
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { XStack } from 'tamagui';

import { StoreActions } from './StoreActions';
import { AnimatedCard } from '../ui/AnimatedCard';
import { AnimatedContainer } from '../ui/AniminatedContainer';
import { FlexText } from '../ui/FlexText';
import { MyButton } from '../ui/MyButton';
import { Empty } from '../ui/empty';

import { StaffSelect } from '~/db/schema';
import { useDrizzle } from '~/hooks/useDrizzle';
import { useStore } from '~/lib/zustand/useStore';

export const Staffs = (): JSX.Element => {
  const { db, schema } = useDrizzle();
  const { data } = useLiveQuery(db.select().from(schema.staff));
  const [staffs, setStaffs] = useState<StaffSelect[]>(data);
  const [value, setValue] = useState('');

  useEffect(() => {}, []);
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      // Do something when the screen is focused
      console.log('Focused');
      const fetchStaffs = async () => {
        try {
          const myStaffs = await db.select().from(schema.staff);
          setStaffs(myStaffs);
        } catch (error) {
          console.log(error);
          setStaffs(data);
        }
      };
      if (isMounted) {
        fetchStaffs();
      }
      return () => {
        isMounted = false;
      };
    }, [])
  );
  const filteredData = useMemo(() => {
    if (!value.trim()) return staffs;

    const lowerCaseValue = value.toLowerCase();
    return staffs.filter((staff) => {
      return staff.name.toLowerCase().includes(lowerCaseValue);
    });
  }, [value, staffs]);
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
        placeholder="by staff name"
        title="Staff"
      />
      <StaffsFlatList data={filteredData} />
    </AnimatedContainer>
  );
};

const StaffsFlatList = ({ data }: { data: StaffSelect[] }) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item, index }) => <StaffCard item={item} index={index} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20, paddingBottom: 20 }}
      ListEmptyComponent={() => <Empty text="No staff yet" />}
      style={{ marginTop: 20 }}
    />
  );
};

const StaffCard = ({ index, item }: { item: StaffSelect; index: number }) => {
  const router = useRouter();
  const isAdmin = useStore((state) => state.isAdmin);
  console.log(isAdmin);
  const onSetDelete = async () => {
    router.push(`/deleteStaff?id=${item.id}`);
  };

  const onEdit = () => {
    router.push(`/addStaff?id=${item.id}`);
  };
  return (
    <AnimatedCard index={index}>
      <FlexText text="Name" text2={item?.name} />
      <FlexText text="Email" text2={item?.email} />

      {isAdmin && (
        <>
          <FlexText text="Password" text2={item?.password} />
          <XStack gap={8}>
            <MyButton title="Remove staff" marginTop={10} onPress={onSetDelete} />
            <MyButton title="Edit staff" marginTop={10} flex={1} onPress={onEdit} />
          </XStack>
        </>
      )}
    </AnimatedCard>
  );
};
