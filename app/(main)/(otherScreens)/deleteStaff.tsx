/* eslint-disable prettier/prettier */

import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { toast } from "sonner-native";


import { DeleteStaffModal } from '~/components/modals/DeleteStaffModal';
import database, { staffs } from '~/db';

export default function DeleteStaff() {
  const [visible, setVisible] = useState(true);

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const onDelete = async () => {
    if (!id) return;
    try {
      await database.write(async () => {
        const staff = await staffs.find(id);
       await staff.destroyPermanently();
      });


      toast.success('Success', {
        description: 'Staff removed successfully',
      })
      setVisible(false);
      router.back();
    } catch (error) {
      console.log(error);
      toast.error('Failed', {
        description: 'Staff could not be removed successfully',
      })

      router.back();
    }
  };

  const onCancel = () => {
    setVisible(false);
    router.back();
  };
  return <DeleteStaffModal visible={visible} onClose={onCancel} onDelete={onDelete} />;
}
