import { Chart } from "react-google-charts";
import { useEffect, useState } from "react";

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

// Google Chartsのデータの型定義
type ChartData = (string | Date)[][];

const Timeline = () => {
  const [data, setData] = useState<ChartData>([]);

  useEffect(() => {
    fetch("data.json")
      .then((response) => response.json() as Promise<SprintData>)
      .then((data) => {
        const chartData: ChartData = data.backlogs.flatMap((backlog) =>
          backlog.subtasks.map((subtask) => [
            backlog.name,
            subtask.name,
            new Date(subtask.start),
            new Date(subtask.end),
          ])
        );
        setData(chartData);
      });
  }, []);

  return (
    <div className="App">
      <Chart
        width={"100%"}
        height={"400px"}
        chartType="Timeline"
        loader={<div>Loading Chart</div>}
        data={[["Backlog Name", "Subtask Name", "Start", "End"], ...data]}
        options={{
          showRowNumber: true,
        }}
        rootProps={{ "data-testid": "1" }}
      />
    </div>
  );
};

export default Timeline;
