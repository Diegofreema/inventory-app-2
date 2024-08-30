/* eslint-disable prettier/prettier */

import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { ExpenditureList } from './ExpenditureList';
import { StoreActions } from './StoreActions';
import { AnimatedContainer } from '../ui/AniminatedContainer';
import { Error } from '../ui/Error';
import { ExpenditureLoader } from '../ui/Loading';

import { useDrizzle } from '~/hooks/useDrizzle';
import { useExpAcc } from '~/lib/tanstack/queries';

export const Expenditure = (): JSX.Element => {
  const [value, setValue] = useState('');
  const onSetValue = useCallback((val: string) => setValue(val), [value]);
  const { refetch, data, isError, isPending, isRefetching } = useExpAcc();
  const { db } = useDrizzle();
  const { data: offlineData } = useLiveQuery(db.query.expenseAccountOffline.findMany());
  console.log({ offlineData });

  const router = useRouter();
  const handleNav = () => {
    router.push('/addExpenditure');
  };
  const onRefetch = useCallback(() => refetch, []);
  const filterAccount = useMemo(() => {
    if (!value.trim()) {
      return data || [];
    }

    const lowerCaseValue = value.toLowerCase();
    return data?.filter((d) => d?.accountName?.toLowerCase().includes(lowerCaseValue)) || [];
  }, [value, data]);
  if (isError) {
    return <Error onRetry={refetch} />;
  }
  return (
    <AnimatedContainer>
      <StoreActions
        placeholder="expenditure name"
        title="Expenditure"
        setVal={onSetValue}
        val={value}
        onPress={handleNav}
      />

      {isPending ? (
        <ExpenditureLoader />
      ) : (
        <ExpenditureList onRefetch={onRefetch} isFetching={isRefetching} data={filterAccount} />
      )}
    </AnimatedContainer>
  );
};
