import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
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

const ChartComponent = () => {
  const [selectedFlu, setSelectedFlu] = useState("inf_a");
  const [selectedRegion, setSelectedRegion] = useState("AMR");
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedWeek, setSelectedWeek] = useState(12);
  const [data, setData] = useState({});
  const [maxRegion, setMaxRegion] = useState("");
  const [maxCases, setMaxCases] = useState(0);

  useEffect(() => {
    axios.get('/data')
      .then((response) => {
        const entries = response.data;

        // ✅ Fix: Coerce year/week to integers
        const filtered = entries.filter(
          (entry) =>
            parseInt(entry.iso_year) === selectedYear &&
            parseInt(entry.iso_week) === selectedWeek &&
            entry.whoregion === selectedRegion
        );

        console.log("🧪 Filtered results:", filtered);

        const regionalCounts = {};
        for (const entry of filtered) {
          if (!regionalCounts[entry.whoregion]) {
            regionalCounts[entry.whoregion] = {};
            fluTypes.forEach((flu) => {
              regionalCounts[entry.whoregion][flu] = 0;
            });
          }
          fluTypes.forEach((flu) => {
            regionalCounts[entry.whoregion][flu] += entry[flu];
          });
        }

        const chartData = {
          labels: Object.keys(regionalCounts),
          datasets: fluTypes.map((flu) => ({
            label: flu.toUpperCase(),
            data: Object.values(regionalCounts).map((region) => region[flu]),
            backgroundColor: fluColors[flu]
          }))
        };

        const regionWithMax = chartData.labels[0];
        const max = chartData.datasets
          .find((d) => d.label.toLowerCase() === selectedFlu)
          ?.data?.[0] ?? 0;

        setMaxRegion(regionWithMax || "N/A");
        setMaxCases(max);
        setData(chartData);
      })
      .catch((err) => {
        console.error("Error loading data:", err);
      });
  }, [selectedFlu, selectedRegion, selectedYear, selectedWeek]);

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", marginTop: "30px" }}>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <select value={selectedFlu} onChange={(e) => setSelectedFlu(e.target.value)}>
          {fluTypes.map((flu) => (
            <option key={flu} value={flu}>{flu.toUpperCase()}</option>
          ))}
        </select>
        <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
          {regions.map((region) => (
            <option key={region} value={region}>{region}</option>
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

      {data.labels?.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          No data available for the selected filters.
        </p>
      ) : (
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
            }
          }}
        />
      )}

      <div style={{ marginTop: "30px", textAlign: "left" }}>
        <h3>Dashboard Summary</h3>
        <p>
          Based on the selected criteria (<strong>{selectedFlu.toUpperCase()}</strong> - Week <strong>{selectedWeek}</strong>, <strong>{selectedYear}</strong>),
          the <strong>{maxRegion}</strong> region has the highest number of reported cases: <strong>{maxCases.toLocaleString()}</strong>.
        </p>
        <p>
          Use the dropdowns above to view trends by flu type, region, week, and year. The chart updates automatically, and
          the color-coded legend below helps identify the data at a glance.
        </p>
      </div>
    </div>
  );
};

export default ChartComponent;


export default ChartComponent;



