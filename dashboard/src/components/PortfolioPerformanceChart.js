import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
      labels: {
        font: {
          family: "'Inter', sans-serif",
          size: 13,
        },
      },
    },
    title: {
      display: true,
      text: "Portfolio Performance & Financial Trends",
      font: {
        family: "'Inter', sans-serif",
        size: 16,
        weight: "600",
      },
      color: "#444",
      padding: {
        bottom: 15,
      },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return ` ₹${context.parsed.y.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        callback: function (value) {
          return "₹" + value.toLocaleString("en-IN");
        },
      },
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
      },
    },
  },
};

export function PortfolioPerformanceChart({ data }) {
  const chartData = data || {
    labels: ["Oct 1", "Oct 5", "Oct 10", "Oct 15", "Oct 20", "Oct 25", "Oct 30", "Nov 3"],
    datasets: [
      {
        label: "Portfolio Equity (₹)",
        data: [28500, 29200, 28900, 30100, 30800, 30450, 31100, 31428],
        borderColor: "#387ed1",
        backgroundColor: "rgba(56, 126, 209, 0.12)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div style={{ height: "300px", width: "100%", marginTop: "20px" }}>
      <Line options={options} data={chartData} />
    </div>
  );
}

export default PortfolioPerformanceChart;

