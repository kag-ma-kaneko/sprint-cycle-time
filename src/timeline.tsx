import Chart from "react-apexcharts";

const Timeline = () => {
  const series = [
    {
      name: "Task 1",
      data: [
        {
          x: "Subtask 1",
          y: [
            new Date("2023-01-01").getTime(),
            new Date("2023-01-02").getTime(),
          ],
        },
        {
          x: "Subtask 2",
          y: [
            new Date("2023-01-02").getTime(),
            new Date("2023-01-03").getTime(),
          ],
        },
      ],
    },
    {
      name: "Task 2",
      data: [
        {
          x: "Subtask 1",
          y: [
            new Date("2023-01-04").getTime(),
            new Date("2023-01-05").getTime(),
          ],
        },
        {
          x: "Subtask 2",
          y: [
            new Date("2023-01-05").getTime(),
            new Date("2023-01-06").getTime(),
          ],
        },
      ],
    },
  ];

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
