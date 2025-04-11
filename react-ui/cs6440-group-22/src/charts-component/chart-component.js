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
  const [labels, setLabels] = useState([]);
  const [regionData, setRegionData] = useState({});

  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(response => {
        const regionsSet = new Set();
        const regionFluMap = {};

        response.data.forEach(entry => {
          const region = entry.whoregion;
          regionsSet.add(region);
          if (!regionFluMap[region]) {
            regionFluMap[region] = { inf_a: 0, inf_b: 0, inf_all: 0, rsv: 0, otherrespvirus: 0 };
          }
          fluTypes.forEach(flu => {
            if (entry[flu]) {
              regionFluMap[region][flu] += entry[flu];
            }
          });
        });

        setLabels(Array.from(regionsSet));
        setRegionData(regionFluMap);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const selectedData = labels.map(region => regionData[region]?.[selectedFlu] || 0);
  const maxCases = Math.max(...selectedData);
  const maxRegion = labels[selectedData.indexOf(maxCases)] || "N/A";

  const data = {
    labels,
    datasets: [
      {
        label: `Total ${selectedFlu.toUpperCase()} cases by WHO Region`,
        data: selectedData,
        backgroundColor: fluColors[selectedFlu]
      }
    ]
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "auto" }}>
      <h2>Flu Cases by WHO Region</h2>

      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "20px" }}>
        <div>
          <label>Flu Type:</label><br />
          <select value={selectedFlu} onChange={(e) => setSelectedFlu(e.target.value)}>
            {fluTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Region:</label><br />
          <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Year:</label><br />
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            min={2000} max={2100}
          />
        </div>
        <div>
          <label>Week:</label><br />
          <input
            type="number"
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
            min={1} max={52}
          />
        </div>
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

