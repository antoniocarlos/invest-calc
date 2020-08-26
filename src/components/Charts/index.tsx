import React from 'react';
import { Chart } from "react-google-charts";

import './styles.css';

interface State {
  data: Array<Array<string | Date | number>>;
}

const Charts: React.FC<State> = ({ data }) => {

  return (
    <div style={{ width: '100%', height:'100%' }}>
    <Chart
      width={'100%'}
      height={'100%'}
      chartType="LineChart"
      loader={<div>Carregando dados</div>}
      data={data}
      options={{
        hAxis: { },
        vAxis: { },
        colors: ['#fcba03', '#0324fc']
      }}
    />
  </div>
  )
}

export default Charts;
