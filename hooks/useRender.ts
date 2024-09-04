import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export const useRender = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mounted, setMounted] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const render = () => {
        console.log('render');

        setMounted((prev) => !prev);
      };
      render();
      return () => {
        render();
      };
    }, [])
  );

  return mounted;
};
