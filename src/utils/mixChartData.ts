interface IMixChartDataProps {
  data: Array<Array<string | Date | number>>;
}

export default function mixChartData(firstData: IMixChartDataProps, secondData: IMixChartDataProps): IMixChartDataProps {
  const formattedData = firstData.data.map((data, index) => {
    if (secondData.data[index]) {
      const cell = data;
      cell.push(secondData.data[index][1]);
      return cell;
    } else {
      return data;
    }
  }
  );

  const response = { data: [...formattedData] };
  console.log(response);

  return response;
}
