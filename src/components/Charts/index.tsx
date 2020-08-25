import React, { useEffect } from 'react';
import { Chart } from "react-google-charts";

import './styles.css';

interface State {
  data: Array<Array<string | Date | number>>;

}

const Charts: React.FC<State> = ({ data }) => {

  return (
    <div style={{ display: 'flex', maxWidth: 900 }}>
    <Chart
      width={800}
      height={'300px'}
      chartType="AreaChart"
      loader={<div>Carregando dados</div>}
      data={data}
      options={{
        title: 'Company Performance',
        hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
        vAxis: { minValue: 0 },
        // For the legend to fit, we make the chart area smaller
        chartArea: { width: '50%', height: '70%' },
        // lineWidth: 25
      }}
    />
  </div>
  )
}

export default Charts;
