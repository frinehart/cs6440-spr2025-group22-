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
    // ✅ FIX: Use relative path so it works in Render too
    axios.get('/data')
      .then(response => {
        const regionsSet = new Set();
        const regionFluMap = {};

        response.data.forEach(entry => {
          const region = entry.whoregion;
          regionsSet.add(region);
          if (!regionFluMap[region]) {
            regionFluMap[region] = {
              inf_a: 0,
              inf_b: 0,
              inf_all: 0,
              rsv: 0,
              otherrespvirus: 0
            };
          }
          fluTypes.forEach(flu => {
            if (entry[flu] !== undefined) {
              regionFluMap[region][flu] += entry[flu];
            }
          });
        });

        setLabels([...regionsSet]);
        setRegionData(regionFluMap);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const chartData = {
    labels,
    datasets: fluTypes.map(flu => ({
      label: flu.toUpperCase(),
      data: labels.map(region => regionData[region]?.[flu] || 0),
      backgroundColor: fluColors[flu]
    }))
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top"
      },
      title: {
        display: true,


