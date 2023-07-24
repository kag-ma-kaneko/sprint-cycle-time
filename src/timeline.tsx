import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

// JSONデータの形式に対応する型を定義
type TaskData = {
  name: string;
  subtasks: {
    name: string;
    start: number;
    end: number;
  }[];
}[];

// ApexChartsのseriesの型定義
type SeriesData = {
  name: string;
  data: {
    x: string;
    y: [number, number];
  }[];
}[];

const Timeline = () => {
  const [series, setSeries] = useState<SeriesData>([]);

  // JSONデータを読み込んで、グラフに表示するデータを作成
  // ApexChartsが欲しがるデータはサブタスクごとに分けられているので、
  useEffect(() => {
    fetch("data.json")
      .then((response) => response.json() as Promise<TaskData>)
      .then((data) => {
        const series = data.flatMap((task) =>
          task.subtasks.map((subtask) => ({
            name: subtask.name,
            data: [
              {
                x: task.name,
                y: [subtask.start, subtask.end] as [number, number],
              },
            ],
          }))
        );
        setSeries(series);
      });
  }, []);

  // グラフ表示形式の設定
  // 横向きで、横軸を時刻にしてTimelineを表示しています
  const options: ApexOptions = {
    chart: {
      type: "rangeBar",
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    xaxis: {
      type: "datetime",
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
