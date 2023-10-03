import React from "react";
import { Bar } from "react-chartjs-2";

const VerticalBarChart = ({ data = [], className = "" }) => {
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
        barPercentage: 0.3,
      },
    ],
  };

  return (
    <div className={`h-[240px] p-1 w-full ${className}`}>
      <Bar
        data={chartData}
        options={{
          indexAxis: "x",
          responsive: true,
        }}
      />
    </div>
  );
};

export default VerticalBarChart;
