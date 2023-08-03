import { Chart } from "react-google-charts";
import { useCallback, useMemo, useState } from "react";

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
  const [sprint, setSprint] = useState<SprintData>();
  const [filter, setFilter] = useState("");

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
            setSprint(data);
          }
        };
        reader.readAsText(file);
      }
    },
    []
  );

  const chartData: ChartData = useMemo(() => {
    if (!sprint) {
      return [];
    }
    return sprint.backlogs.flatMap((backlog) => {
      return backlog.subtasks
        .filter((subtask) => subtask.pic.includes(filter))
        .map((subtask) => [
          backlog.name,
          subtask.name,
          new Date(subtask.start),
          new Date(subtask.end),
        ]);
    });
  }, [sprint, filter]);

  return (
    <div className="App">
      <input
        type="text"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Filter by PIC"
      />
      <input type="file" onChange={handleFileChange} className="file-input" />
      {sprint && chartData.length > 0 && (
        <Chart
          width={"100%"}
          height={"100vh"}
          chartType="Timeline"
          loader={<div>Loading Chart</div>}
          data={[
            ["Backlog Name", "Subtask Name", "Start", "End"],
            ...chartData,
          ]}
          options={{
            showRowNumber: true,
            hAxis: {
              format: "MM/dd HH:mm",
              minValue: new Date(sprint?.metaData.beginDete ?? ""),
              maxValue: new Date(sprint?.metaData.endDate ?? ""),
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
