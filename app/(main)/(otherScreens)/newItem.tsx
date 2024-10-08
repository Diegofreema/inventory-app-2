import { Container } from '~/components/Container';
import { ProductForm } from '~/components/form/ProductForm';
import { CustomScroll } from '~/components/ui/CustomScroll';

export default function Home() {
  return (
    <Container paddingHorizontal={0}>
      <CustomScroll>
        <ProductForm />
      </CustomScroll>
    </Container>
  );
}
