/* eslint-disable prettier/prettier */

import { Container } from '~/components/Container';
import { AddStaffForm } from '~/components/form/AddStaffForm';
import { CustomScroll } from '~/components/ui/CustomScroll';
import { NavHeader } from '~/components/ui/NavHeader';

const AddStaff = (): JSX.Element => {
  return (
    <Container>
      <NavHeader title="Add staff" />
      <CustomScroll>
        <AddStaffForm />
      </CustomScroll>
    </Container>
  );
};

export default AddStaff;
