/* eslint-disable prettier/prettier */

import HomeComponent from '~/components/home/Homecomponent';
import { onlineSales, products, storeSales } from '~/db';

// import { getSale } from '~/lib/helper';

export default function Home() {
  return <HomeComponent products={products} onlineSales={onlineSales} storeSales={storeSales} />;
}
