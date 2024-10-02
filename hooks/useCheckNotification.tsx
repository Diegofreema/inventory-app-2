/* eslint-disable prettier/prettier */

import { Audio } from 'expo-av';
import * as Store from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

import { useRead } from '~/lib/zustand/useRead';
import { NotType } from '~/type';

type Props = {
  data: NotType[] | undefined;
};

export const useCheckNotification = ({ data }: Props) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const setUnread = useRead((state) => state.setUnread);

  const loadSound = useCallback(async () => {
    if (sound) return;
    console.log('Loading Sound');
    const { sound: newSound } = await Audio.Sound.createAsync(require('../assets/notify.mp3'));
    setSound(newSound);
  }, [sound]);

  const playSound = useCallback(async () => {
    if (!sound) await loadSound();
    console.log('Playing Sound');
    await sound?.playAsync();
  }, [sound, loadSound]);

  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [loadSound, sound]);

  useEffect(() => {
    if (!data) return;

    const checkIfNewData = async () => {
      const storedLength = Store.getItem('dataLength');
      const prevLength = storedLength ? parseInt(storedLength, 10) : 0;

      if (data.length > prevLength) {
        await playSound();
        setUnread();
        Store.setItem('dataLength', data.length.toString());
      }
    };

    checkIfNewData();
  }, [data, playSound]);

  return { playSound };
};
