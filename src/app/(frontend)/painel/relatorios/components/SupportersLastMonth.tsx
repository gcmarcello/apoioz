"use client";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useReports } from "../hooks/useReports";

interface LineProps {
  options: ChartOptions<"line">;
  data: ChartData<"line">;
}

export function SupportersLastMonth() {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  const { supporters: supporterData } = useReports();

  const options: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: "top" as const,
      },
      title: {
        display: true,
        color: "rgb(55 65 81)",
        text: "Apoiadores no último mês",
        font: {
          size: 20,
        },
      },
    },
  };
  const labels = [];
  const today = dayjs();
  for (let i = 29; i >= 0; i--) {
    const date = today.subtract(i, "day");
    const formattedDate = `${date.format("MMMM")} ${date.date()}`;
    labels.push(formattedDate);
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Apoiadores",
        data: labels.map((arg) => {
          return supporterData?.data?.filter((supporter) =>
            dayjs(supporter.createdAt).isBefore(
              dayjs(arg, "MMMM D").set("year", dayjs().year())
            )
          ).length;
        }),
        backgroundColor: "rgba(79, 70, 229, 0.75)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
