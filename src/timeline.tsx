import { Chart } from "react-google-charts";
import { useCallback, useState } from "react";

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
    pic: string;
    start: string;
    end: string;
  }[];
};

// Google Chartsのデータの型定義
type ChartData = (string | Date)[][];

const Timeline = () => {
  const [data, setData] = useState<ChartData>([]);
  const [sprint, setSprint] = useState<SprintMetaData>();

  // ファイル選択時の処理
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          if (typeof result === "string") {
            const data = JSON.parse(result) as SprintData;
            setSprint(data.metaData);
            const chartData: ChartData = data.backlogs.flatMap((backlog) =>
              backlog.subtasks.map((subtask) => [
                backlog.name,
                subtask.name,
                new Date(subtask.start),
                new Date(subtask.end),
              ])
            );
            setData(chartData);
          }
        };
        reader.readAsText(file);
      }
    },
    []
  );

  return (
    <div className="App">
      <input type="file" onChange={handleFileChange} className="file-input" />
      {sprint && (
        <Chart
          width={"100%"}
          height={"100vh"}
          chartType="Timeline"
          loader={<div>Loading Chart</div>}
          data={[["Backlog Name", "Subtask Name", "Start", "End"], ...data]}
          options={{
            showRowNumber: true,
            hAxis: {
              format: "MM/dd HH:mm",
              minValue: new Date(sprint?.beginDete ?? ""),
              maxValue: new Date(sprint?.endDate ?? ""),
            },
            timeline: {
              groupByRowLabel: true,
            },
          }}
          rootProps={{ "data-testid": "1" }}
        />
      )}
    </div>
  );
};

export default Timeline;
