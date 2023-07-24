import { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const Timeline = () => {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => setSeries(data));
  }, []);

  // グラフ表示形式の設定
  // 横向きで、横軸を時刻にしてTimelineを表示しています
  const options = {
    chart: {
      type: "rangeBar" as const,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      type: "datetime" as const,
    },
    yaxis: {
      reversed: true,
    },
  };

  return (
    <div className="App">
      <Chart options={options} series={series} type="rangeBar" height="350" />
    </div>
  );
};

export default Timeline;
