import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import dayjs from "dayjs";

// JSONデータの形式に対応する型を定義
type SprintData = {
  metaData: SprintMetaData;
  backlogs: BacklogData[];
};

type SprintMetaData = {
  sprintNo: number;
  beginDete: string;
  endDate: string;
};

type BacklogData = {
  name: string;
  subtasks: {
    name: string;
    pic: string[];
    start: string;
    end: string;
  }[];
};

// ApexChartsのseriesの型定義
type SeriesData = {
  name: string;
  data: {
    x: string;
    y: [number, number];
  }[];
}[];

const Timeline = () => {
  const [sprint, setSprint] = useState<SprintMetaData>({} as SprintMetaData);
  const [backlogs, setBacklogs] = useState<BacklogData[]>([]);

  // JSONデータを読み込んで、グラフに表示するデータを作成
  // ApexChartsが欲しがるデータはサブタスクごとに分けられている
  useEffect(() => {
    fetch("data.json")
      .then((response) => response.json() as Promise<SprintData>)
      .then((data) => {
        setSprint(data.metaData);
        setBacklogs(data.backlogs);
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
        dataLabels: { hideOverflowingLabels: false, position: "top" },
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: false,
        formatter: (value) => {
          return dayjs(value).format("MM/DD HH:mm");
        },
      },
      min: new Date(sprint.beginDete).getTime(),
      max: new Date(sprint.endDate).getTime(),
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
    dataLabels: {
      enabled: true,
      formatter: (_val, options) => {
        return options.w.globals.seriesNames[options.seriesIndex];
      },
      style: { colors: ["#000"] },
    },
  };

  return (
    <div className="App">
      {backlogs.map((backlog, index) => {
        const series = backlog.subtasks.map((subtask) => ({
          name: subtask.name,
          data: [
            {
              x: backlog.name,
              y: [
                new Date(subtask.start).getTime(),
                new Date(subtask.end).getTime(),
              ] as [number, number],
            },
          ],
        }));

        return (
          <div key={index}>
            <h2>{backlog.name}</h2>
            <Chart
              options={options}
              series={series}
              type="rangeBar"
              height="700"
            />
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
