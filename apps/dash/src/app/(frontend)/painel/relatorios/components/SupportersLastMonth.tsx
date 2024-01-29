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
} from "chart.js";
import { readSupportersFromSupporterGroupWithRelation } from "@/app/api/panel/supporters/service";
import { ChartContainer, createChart } from "odinkit/client";
import { ExtractSuccessResponse } from "odinkit";

interface SupportersLastMonthProps {
  supporterData: ExtractSuccessResponse<
    typeof readSupportersFromSupporterGroupWithRelation
  >;
}

export function SupportersLastMonth({
  supporterData,
}: SupportersLastMonthProps) {
  const labels = [];

  for (let i = 29; i >= 0; i--) {
    labels.push(dayjs().subtract(i, "day").format("MMMM D"));
  }

  const chartData = labels.map((label) => {
    return supporterData.filter(
      (supporter) => dayjs(supporter.createdAt).format("MMMM D") === label
    ).length;
  });

  const supporterSumEachDay = chartData.reduce<number[]>((acc, curr, index) => {
    if (index === 0) {
      acc.push(curr);
    } else {
      acc.push(acc[index - 1]! + curr);
    }
    return acc;
  }, []);

  const chart = createChart({
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Apoiadores",
          data: supporterSumEachDay,
          backgroundColor: "rgba(79, 70, 229, 0.75)",
        },
      ],
    },
    options: {
      aspectRatio: 1.5,
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
    },
  });

  return <ChartContainer chart={chart} />;
}
