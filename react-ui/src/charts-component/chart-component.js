import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Legend,
  Tooltip
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Legend, Tooltip);

// Flu types and regions
const fluTypes = ["inf_a", "inf_b", "inf_all", "rsv", "otherrespvirus"];
const regions = ["AFR", "AMR", "EMR", "EUR", "SEAR", "WPR"];
const fluColors = {
  inf_a: "rgba(54, 162, 235, 0.6)",
  inf_b: "rgba(255, 99, 132, 0.6)",
  inf_all: "rgba(255, 206, 86, 0.6)",
  rsv: "rgba(75, 192, 192, 0.6)",
  otherrespvirus: "rgba(153, 102, 255, 0.6)"
};

// Helper to generate random numbers within a range
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const ChartComponent = () => {
  const [selectedFlu, setSelectedFlu] = useState("inf_a");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedWeek, setSelectedWeek] = useState(12);
  const [data, setData] = useState({});
  const [maxRegion, setMaxRegion] = useState("");
  const [maxCases, setMaxCases] = useState(0);

  useEffect(() => {
    // Simulate flu case totals for each region
    const regionTotals = {};
    regions.forEach(region => {
      regionTotals[region] = getRandomInt(100000, 3500000); // make it look realistic
    });

    const chartData = {
      labels: regions,
      datasets: [
        {
          label: `Total ${selectedFlu.toUpperCase()} cases by WHO Region`,
          data: regions.map(region => regionTotals[region]),
          backgroundColor: fluColors[selectedFlu]
        }
      ]
    };

    const max = Math.max(...chartData.datasets[0].data);
    const maxRegionIndex = chartData.datasets[0].data.indexOf(max);
    const regionWithMax = chartData.labels[maxRegionIndex];

    setMaxRegion(regionWithMax || "N/A");
    setMaxCases(max);
    setData(chartData);
  }, [selectedFlu, selectedYear, selectedWeek]);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginTop: "30px" }}>
      {/* Filters */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <select value={selectedFlu} onChange={(e) => setSelectedFlu(e.target.value)}>
          {fluTypes.map((flu) => (
            <option key={flu} value={flu}>{flu.toUpperCase()}</option>
          ))}
        </select>
        <input
          type="number"
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          min={2000} max={2030}
        />
        <input
          type="number"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
          min={1} max={52}
        />
      </div>

      {/* Legend */}
      <div style={{ marginBottom: "20px" }}>
        <strong>Flu Type Color Legend:</strong>
        <div style={{ display: "flex", gap: "15px", marginTop: "8px" }}>
          {Object.entries(fluColors).map(([type, color]) => (
            <div key={type} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "16px", height: "16px", backgroundColor: color, borderRadius: "3px" }}></div>
              <span>{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: { display: true },
            title: {
              display: true,
              text: `Cases of ${selectedFlu.toUpperCase()} by WHO Region`
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              }
            }
          }
        }}
      />

      {/* Summary */}
      <div style={{ marginTop: "30px", textAlign: "left" }}>
        <h3>Dashboard Summary</h3>
        <p>
          Based on the selected criteria (<strong>{selectedFlu.toUpperCase()}</strong> - Week <strong>{selectedWeek}</strong>, <strong>{selectedYear}</strong>),
          the <strong>{maxRegion}</strong> region has the highest number of reported cases: <strong>{maxCases.toLocaleString()}</strong>.
        </p>
      </div>
    </div>
  );
};

export default ChartComponent;










