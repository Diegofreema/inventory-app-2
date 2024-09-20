/* eslint-disable prettier/prettier */
import { withObservables } from '@nozbe/watermelondb/react';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { YStack } from 'tamagui';

import { StoreActions } from './StoreActions';
import { AnimatedCard } from '../ui/AnimatedCard';
import { AnimatedContainer } from '../ui/AniminatedContainer';
import { FlexText } from '../ui/FlexText';
import { MyButton } from '../ui/MyButton';
import { Empty } from '../ui/empty';

import { staffs } from '~/db';
import Staff from '~/db/model/Staff';
import { useRender } from '~/hooks/useRender';
import { trimText } from '~/lib/helper';
import { useStore } from '~/lib/zustand/useStore';

const AllStaffs = ({ staffs }: { staffs: Staff[] }): JSX.Element => {
  const [value, setValue] = useState('');
  useRender();

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

const enhance = withObservables([], () => ({
  staffs: staffs.query().observe(),
}));
export const Staffs = enhance(AllStaffs);

const StaffsFlatList = ({ data }: { data: Staff[] }) => {
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

const StaffCard = ({ index, item }: { item: Staff; index: number }) => {
  const router = useRouter();
  const isAdmin = useStore((state) => state.isAdmin);

  const onSetDelete = async () => {
    router.push(`/deleteStaff?id=${item.id}`);
  };

  const onEdit = () => {
    router.push(`/addStaff?id=${item.id}`);
  };
  return (
    <AnimatedCard index={index}>
      <FlexText text="Name" text2={trimText(item?.name, 22)} />
      <FlexText text="Email" text2={trimText(item?.email, 22)} />

      {isAdmin && (
        <>
          <FlexText text="Password" text2={item?.password} />
          <YStack gap={8}>
            <MyButton title="Remove staff" marginTop={10} onPress={onSetDelete} />
            <MyButton title="Edit staff" marginTop={10} flex={1} onPress={onEdit} />
          </YStack>
        </>
      )}
    </AnimatedCard>
  );
};
