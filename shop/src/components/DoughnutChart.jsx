import React from "react";
import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

const DoughnutChart = ({ data = [] }) => {
  const chartData = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        label: "Doanh thu",
        data: data.map((item) => item.revenue),
        backgroundColor: [
          "#0f172a",
          "#334155",
          "#64748b",
          "#94a3b8",
          "#e2e8f0",
          "#082f49",
          "#94a3b8",
        ],
        hoverBackgroundColor: [
          "#0f172a",
          "#334155",
          "#64748b",
          "#94a3b8",
          "#e2e8f0",
          "#082f49",
          "#94a3b8",
        ],
      },
    ],
  };

  return (
    <Doughnut
      className="p-5"
      data={chartData}
      options={{
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
        },
      }}
      type={Chart.defaults.doughnut ? Chart.defaults.doughnut.type : ""}
    />
  );
};

export default DoughnutChart;
