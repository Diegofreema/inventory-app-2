/* eslint-disable prettier/prettier */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { DeleteStaffModal } from '~/components/modals/DeleteStaffModal';
import database, { staffs } from '~/db';
import { useShowToast } from '~/lib/zustand/useShowToast';

export default function DeleteStaff() {
  const [visible, setVisible] = useState(true);
  const toast = useShowToast((state) => state.onShow);

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const onDelete = async () => {
    if (!id) return;
    try {
      await database.write(async () => {
        const staff = await staffs.find(id);
        await staff.destroyPermanently();
      });

      toast({ message: 'Success', description: 'Staff removed successfully', type: 'success' });
      setVisible(false);
      router.back();
    } catch (error) {
      console.log(error);
      toast({
        message: 'Failed',
        description: 'Staff could not be removed successfully',
        type: 'error',
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
