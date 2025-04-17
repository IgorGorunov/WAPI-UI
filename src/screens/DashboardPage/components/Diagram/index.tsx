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
  ChartOptions,
  elements,
  plugins,
  scales, TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./styles.scss";
import { PeriodType, PeriodTypes } from "@/types/dashboard";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    elements,
    plugins,
    scales,
);

type DataPoint = {
  Key: string;
  Value: number;
};

type DashboardDataProps = {
  diagramData: {
    [PeriodTypes.DAY]: DataPoint[];
    [PeriodTypes.WEEK]: DataPoint[];
    [PeriodTypes.MONTH]: DataPoint[];
  }
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

function getBackgroundColor(value: number): string {
  if (value < 1 ) {
    return "#5380F5";
  } else {
    return hexToRgba("#5380F5", 0.05);
   }
}


let Diagram: React.FC<DashboardDataProps> = ({
  diagramData,
    diagramType = "DAY",
    setDiagramType
}) => {

  let chartRef = useRef<ChartJS<"bar", number[], string> | null>(null);

  let labels = diagramData && diagramData[diagramType]
      ? diagramData[diagramType].map((item) => item.Key)
      : [];
  let values = diagramData && diagramData[diagramType]
      ? diagramData[diagramType].map((item) => item.Value)
      : [];

  let backgroundColors = values.map(value => getBackgroundColor(value));

  let data = useMemo(
    () => ({
      labels: labels,
      datasets: [
        {
          label: "",
          data: values,
          borderColor: "#5380F5",
          backgroundColor: backgroundColors,
          barPercentage: 1.25,
        },
      ],
    }),
    [labels, values]
  );

  let defaultOptions: ChartOptions<'bar'>;
  defaultOptions = {

    maintainAspectRatio: false,
    elements: {
      bar: {
        borderWidth: {
          top: 2,
        },
        hoverBackgroundColor: hexToRgba("#5380F5", 0.15),
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label(tooltipItem: TooltipItem<"bar">): string | string[] | void {
            return "";
          },
          footer(tooltipItems: TooltipItem<'bar'>[]): string | string[] | void {
            return "";
          },
          title(tooltipItems: TooltipItem<'bar'>[]): string | string[] | void {
            const tooltipItem = tooltipItems[0];
            if (tooltipItem) {
              const value = tooltipItem.formattedValue;
              return `Orders ${value}`;
            }
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
        grid: {
          drawTicks: false,
        }
      },
      x: {
        ticks: {
          font: {
            size: 13,
            weight: "bold",
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
    <div className={`card dashboard-diagram__wrapper mb-md`}>
      <div className="dashboard-diagram__header">
        <p className='title-h4'>Orders</p>
        <div className="dashboard-diagram__diagram-types">
          <div
            className={`dashboard-diagram__option ${
              diagramType === "DAY" ? "active" : ""
            }`}
            onClick={() => setDiagramType("DAY")}
          >
            Days
          </div>
          <div
            className={`dashboard-diagram__option ${
              diagramType === "WEEK" ? "active" : ""
            }`}
            onClick={() => setDiagramType("WEEK")}
          >
            Weeks
          </div>
          <div
            className={`dashboard-diagram__option ${
              diagramType === "MONTH" ? "active" : ""
            }`}
            onClick={() => setDiagramType("MONTH")}
          >
            Months
          </div>
        </div>
      </div>
      <div style={{ height: 250 }}>
        <Bar
          ref={(ref: any) => {
            chartRef.current = ref?.chartInstance;
          }}
          data={data}
          options={defaultOptions}
        />
      </div>
    </div>
  );
};

export default React.memo(Diagram);
