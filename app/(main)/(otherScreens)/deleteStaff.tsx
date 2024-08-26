/* eslint-disable prettier/prettier */

import { eq } from 'drizzle-orm';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import Toast from 'react-native-toast-message';

import { DeleteStaffModal } from '~/components/modals/DeleteStaffModal';
import { useDrizzle } from '~/hooks/useDrizzle';

export default function DeleteStaff() {
  const [visible, setVisible] = useState(true);
  const { db, schema } = useDrizzle();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const onDelete = async () => {
    if (!id) return;
    try {
      await db.delete(schema.staff).where(eq(schema.staff.id, +id));

      Toast.show({
        text1: 'Success',
        text2: 'Staff removed successfully',
      });
      setVisible(false);
      router.back();
    } catch (error) {
      console.log(error);
      Toast.show({
        text1: 'Failed',
        text2: 'Staff could not be removed successfully',
      });
      router.back();
    }
  };

  const onCancel = () => {
    setVisible(false);
    router.back();
  };
  return <DeleteStaffModal visible={visible} onClose={onCancel} onDelete={onDelete} />;
}
