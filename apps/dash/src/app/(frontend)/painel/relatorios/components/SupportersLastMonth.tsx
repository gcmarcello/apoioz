"use client";
import dayjs from "dayjs";

import { readSupportersFromSupporterGroupWithRelation } from "@/app/api/panel/supporters/service";
import { ChartContainer, createChart } from "odinkit/client";
import { SupporterWithReferral } from "../context/report.ctx";

export function SupportersLastMonth({
  supporterData,
}: {
  supporterData: SupporterWithReferral[];
}) {
  const labels = [];

  for (let i = 29; i >= 0; i--) {
    labels.push(dayjs().subtract(i, "day").format("MMMM D"));
  }

  const initialsupporterData = supporterData.filter((s) =>
    dayjs(s.createdAt).isBefore(dayjs().subtract(30, "day"))
  ).length;

  const chartData = labels.map((label) => {
    return supporterData.filter(
      (supporter) => dayjs(supporter.createdAt).format("MMMM D") === label
    ).length;
  });

  const supporterSumEachDay = chartData.reduce<number[]>((acc, curr, index) => {
    if (index === 0) {
      acc.push(curr + initialsupporterData);
    } else {
      acc.push(acc[index - 1]! + curr);
    }
    return acc;
  }, []);

  const maxYValue =
    Math.round((Math.max(...supporterSumEachDay) + 100) / 100) * 100;

  const chart = createChart({
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Apoiadores",
          data: supporterSumEachDay,
          backgroundColor: "rgba(225, 29, 72)",
        },
      ],
    },
    options: {
      aspectRatio: 1.5,
      scales: {
        y: {
          beginAtZero: true,
          max: maxYValue,
        },
      },
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
