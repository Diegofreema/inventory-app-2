/* eslint-disable prettier/prettier */

import { XStack } from 'tamagui';

import { MyButton } from './MyButton';

type Props = {
  handlePagination: (direction: 'next' | 'prev') => void;
  page: number;
  isLastPage: boolean;
};

export const PaginationButton = ({ handlePagination, isLastPage, page }: Props): JSX.Element => {
  return (
    <XStack justifyContent="center" gap={10} mb={10}>
      <MyButton
        title="Previous"
        onPress={() => handlePagination('prev')}
        minWidth="$11"
        disabled={page === 1}
      />
      <MyButton
        title="Next"
        onPress={() => handlePagination('next')}
        minWidth="$11"
        disabled={isLastPage}
      />
    </XStack>
  );
};
