import Chart from "react-apexcharts";

const Timeline = () => {
  const series = [
    //data on the y-axis
    {
      name: "Temperature in Celsius",
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    },
  ];
  const options = {
    //data on the x-axis
    chart: { id: "bar-chart" },
    xaxis: {
      categories: [],
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="bar" width="450" />
    </div>
  );
};

export default Timeline;
