import React, { useEffect, useRef, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import classes from "./Diagram.module.scss";
//import { inter } from "../../../../pages/_app";
import { PeriodType } from "@/types/dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
);

type DataPoint = {
  Key: string;
  Value: number;
};

type DashboardDataProps = {
  diagramData: DataPoint[];
  diagramType?: PeriodType;
  setDiagramType: React.Dispatch<React.SetStateAction<PeriodType>>;
};

function hexToRgba(hex: string, opacity: number): string {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const Diagram: React.FC<DashboardDataProps> = ({
  diagramData,
  diagramType = "DAY",
  setDiagramType,
}) => {
  const chartRef = useRef<any>(0);

  const labels = diagramData.map((item) => item.Key);
  const values = diagramData.map((item) => item.Value);

  const data = useMemo(
    () => ({
      labels: labels,
      datasets: [
        {
          label: "",
          data: values,
          borderColor: "#5380F5",
          backgroundColor: hexToRgba("#5380F5", 0.05),
          barPercentage: 1.25,
        },
      ],
    }),
    [labels, values]
  );

  const defaultOptions = {
    maintainAspectRatio: false,
    elements: {
      bar: {
        borderWidth: {
          top: 2,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any[]) => {
            return "";
          },
          footer: (context: any[]) => {
            return "";
          },
          title: (context: any[]) => {
            const tooltipItem = context[0];
            if (tooltipItem) {
              const value = tooltipItem.formattedValue;
              return `Orders ${value}`;
            }
            return "";
          },
        },
        mode: "nearest",
        intersect: false,
        backgroundColor: "#5380F5",
        titleColor: "white",
        bodyColor: "white",
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 13,
        },
        yAlign: "bottom",
      },
    },
    scales: {
      y: {
        ticks: {
          font: {
            size: 13,
            weight: "bold",
          },
          color: "#ADB8CC",
        },
        position: "right",
      },
      x: {
        ticks: {
          font: {
            size: 13,
            weight: "Bold",
          },
          color: "#5380F5",
        },
        grid: {
          display: false,
        },
      },
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      const chartInstance = chartRef.current;
      chartInstance.destroy();
    }
  }, [data]);

  return (
    <div className={`card ${classes.wrapper} mb-md`} style={{ height: 370 }}>
      <div className={classes.header}>
        <h4 className={classes.title}>Orders</h4>
        <div className={classes["diagram-types"]}>
          <div
            className={`${classes.option} ${
              diagramType === "DAY" ? classes.active : ""
            }`}
            onClick={() => setDiagramType("DAY")}
          >
            Days
          </div>
          <div
            className={`${classes.option} ${
              diagramType === "WEEK" ? classes.active : ""
            }`}
            onClick={() => setDiagramType("WEEK")}
          >
            Weeks
          </div>
          <div
            className={`${classes.option} ${
              diagramType === "MONTH" ? classes.active : ""
            }`}
            onClick={() => setDiagramType("MONTH")}
          >
            Months
          </div>
        </div>
      </div>
      <Bar
        ref={(ref: any) => {
          chartRef.current = ref?.chartInstance;
        }}
        data={data}
        options={defaultOptions}
      />
    </div>
  );
};

export default React.memo(Diagram);
