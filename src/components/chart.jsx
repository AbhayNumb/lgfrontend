import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useWebContext } from "../context/contextprovider";
import { MoonLoader } from "react-spinners";
import { initFlowbite } from "flowbite";

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartComp = () => {
  const { dnsdata } = useWebContext();
  const [typeDistribution, setTypeDistribution] = useState({});
  const [nameDistribution, setNameDistribution] = useState({});
  useEffect(() => {
    initFlowbite();
    if (Array.isArray(dnsdata)) {
      const getTypeDistribution = () => {
        return dnsdata.reduce((acc, record) => {
          const type = record.Type;
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});
      };

      const getNameDistribution = () => {
        return dnsdata.reduce((acc, record) => {
          const name = record.Name;
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {});
      };

      setTypeDistribution(getTypeDistribution());
      setNameDistribution(getNameDistribution());
    }
  }, [dnsdata]);

  const data = {
    labels: Object.keys(typeDistribution),
    datasets: [
      {
        data: Object.values(typeDistribution),
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
          "rgb(255, 159, 64)",
          "rgb(255, 0, 0)",
          "rgb(0, 255, 0)",
          "rgb(0, 0, 255)",
          "rgb(128, 128, 128)",
        ],
        hoverOffset: 4,
      },
    ],
  };
  // Function to generate random colors
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
        Math.random() * 256
      )}, ${Math.floor(Math.random() * 256)}, 0.6)`;
      colors.push(color);
    }
    return colors;
  };

  // Prepare data for the chart
  const labels = Object.keys(nameDistribution);
  const namedata = {
    labels: labels,
    datasets: [
      {
        data: Object.values(nameDistribution),
        backgroundColor: generateColors(labels.length),
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 flex  items-center justify-center border-gray-200 border-dashed rounded-lg dark:border-gray-700">
        <div
          className="flex  flex-col items-center justify-center"
          style={{ width: "50%", height: "50%", gap: "5rem" }}
        >
          {dnsdata === "None" ? (
            <div
              className="flex items-center justify-center"
              style={{ width: "100%", height: "100vh" }}
            >
              <div>
                <MoonLoader color="#1A56DB" />
              </div>
            </div>
          ) : (
            <>
              <Doughnut data={data} />
              <>Distribution By Record Type</>
              <Doughnut data={namedata} />
              <>Distribution By Record Name</>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartComp;
