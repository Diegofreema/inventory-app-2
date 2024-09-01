/* eslint-disable prettier/prettier */
import { Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import { Stack, XStack } from 'tamagui';

import { CustomHeading } from '../ui/typography';

import { colors } from '~/lib/helper';
import { ChartType } from '~/type';

const screenWidth = Dimensions.get('window').width * 0.85;
type Props = {
  label: string;
  data: ChartType[];
};
const chartConfig: AbstractChartConfig = {
  backgroundColor: 'transparent',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 30,
  },
  formatYLabel(yLabel) {
    return `#${yLabel}`;
  },
  barRadius: 10,
};

export const Chart = ({ label, data: dt }: Props): JSX.Element => {
  const finalData = dt?.map((d, i) => ({
    name: d.name,
    amount: d?.amount,
    color: colors[i],
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  }));
  return (
    <Stack marginVertical={20} borderWidth={1} borderColor="#ccc" borderRadius={10}>
      <XStack paddingHorizontal={20}>
        <CustomHeading text={label} fontSize={15} />
      </XStack>
      <PieChart
        data={finalData}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        accessor="amount"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[0, 0]}
        absolute
      />
    </Stack>
  );
};
