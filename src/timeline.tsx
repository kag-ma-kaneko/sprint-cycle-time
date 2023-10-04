import { Chart } from "react-google-charts";
import { useCallback, useMemo, useState } from "react";

// JSONデータの形式に対応する型を定義
type SprintData = {
  metaData: SprintMetaData;
  backlogs: BacklogData[];
};

type SprintMetaData = {
  sprintNo: number;
  beginDate: string;
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

// ISO8601形式の日付文字列をYYYY-MM-DD形式に変換する関数
function convertISOtoYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 月は0から始まるため+1し、2桁になるように0でパディング
  const day = date.getDate().toString().padStart(2, "0"); // 2桁になるように0でパディング

  return `${year}-${month}-${day}`;
}

const Timeline = () => {
  const [sprint, setSprint] = useState<SprintData>();
  const [filter, setFilter] = useState("");

  const [zoomStart, setZoomStart] = useState("");
  const [zoomEnd, setZoomEnd] = useState("");

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
            console.log(data);
            setSprint(data);
            setZoomStart(
              convertISOtoYYYYMMDD(new Date(data.metaData.beginDate.toString()))
            );
            setZoomEnd(
              convertISOtoYYYYMMDD(new Date(data.metaData.endDate.toString()))
            );
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
        .filter((subtask) => {
          const start = new Date(subtask.start);
          const end = new Date(subtask.end);
          return start >= new Date(zoomStart) && end <= new Date(zoomEnd);
        })
        .map((subtask) => [
          backlog.name,
          subtask.name,
          new Date(subtask.start),
          new Date(subtask.end),
        ]);
    });
  }, [sprint, filter, zoomStart, zoomEnd]);

  return (
    <div className="App">
      <input
        type="text"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Filter by PIC"
      />
      <input
        type="date"
        value={zoomStart}
        onChange={(event) => setZoomStart(event.target.value)}
        placeholder="Zoom Start Date"
        className="zoom-input"
      />
      <input
        type="date"
        value={zoomEnd}
        onChange={(event) => setZoomEnd(event.target.value)}
        placeholder="Zoom End Date"
        className="zoom-input"
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
              minValue: new Date(zoomStart),
              maxValue: new Date(zoomEnd),
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
