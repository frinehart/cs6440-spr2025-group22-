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

const fluTypes = ["inf_a", "inf_b", "inf_all", "rsv", "otherrespvirus"];
const regions = ["AFR", "AMR", "EMR", "EUR", "SEAR", "WPR"];
const fluColors = {
  inf_a: "rgba(54, 162, 235, 0.6)",
  inf_b: "rgba(255, 99, 132, 0.6)",
  inf_all: "rgba(255, 206, 86, 0.6)",
  rsv: "rgba(75, 192, 192, 0.6)",
  otherrespvirus: "rgba(153, 102, 255, 0.6)"
};

// Utility: Random number between 100k and 3.5M
const getRandomCases = () => Math.floor(Math.random() * (3500000 - 100000 + 1)) + 100000;

const ChartComponent = () => {
  const [selectedFlu, setSelectedFlu] = useState("inf_a");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedWeek, setSelectedWeek] = useState(12);
  const [data, setData] = useState({});
  const [maxRegion, setMaxRegion] = useState("");
  const [maxCases, setMaxCases] = useState(0);

  useEffect(() => {
    const regionData = regions.map(region => ({
      region,
      cases: getRandomCases()
    }));

    const chartData = {
      labels: regionData.map(r => r.region),
      datasets: [
        {
          label: `Total ${selectedFlu.toUpperCase()} cases by WHO Region`,
          data: regionData.map(r => r.cases),
          backgroundColor: fluColors[selectedFlu]
        }
      ]
    };

    const max = Math.max(...regionData.map(r => r.cases));
    const maxRegionEntry = regionData.find(r => r.cases === max);

    console.log("Generated mock data:", regionData);

    setData(chartData);
    setMaxRegion(maxRegionEntry.region);
    setMaxCases(max);
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










