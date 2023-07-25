import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";

// JSONデータの形式に対応する型を定義
type TaskData = {
  name: string;
  subtasks: {
    name: string;
    start: string;
    end: string;
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
  const sprinttBeginDate = new Date("2023-07-19").getTime();

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
                y: [
                  new Date(subtask.start).getTime(),
                  new Date(subtask.end).getTime(),
                ] as [number, number],
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
      width: "100%",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        dataLabels: {
          hideOverflowingLabels: false,
        },
        barHeight: "80%",
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          fontSize: "20px",
        },
        datetimeUTC: false,
        formatter: (value) => {
          return dayjs(value).format("MM/DD HH:mm");
        },
      },
      min: sprinttBeginDate,
      max: sprinttBeginDate + 1000 * 60 * 60 * 24 * 14,
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "20px",
        },
      },
    },
    grid: {
      borderColor: "#000",
    },
    legend: { show: false },
  };

  return (
    <div className="App">
      <Chart options={options} series={series} type="rangeBar" height="700" />
    </div>
  );
};

export default Timeline;
