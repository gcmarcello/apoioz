"use client";
import { LoadingSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { generateRandomHexColor } from "@/app/(frontend)/_shared/utils/colors";
import { faker } from "@faker-js/faker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Chart } from "chart.js/dist";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useReports } from "../hooks/useReports";

export function ReferralRanking() {
  const { supporters: supporterData } = useReports();
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const options: ChartOptions = {
    responsive: true,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        color: "rgb(55 65 81)",
        text: "Ranking de Indicações",
        font: {
          size: 20,
        },
      },
    },
  };

  const labels = [];
  supporterData?.data.forEach((a) => {
    if (a.referralId && labels.find((ref) => ref.id === a.referralId)) {
      labels.find((ref) => ref.id === a.referralId).count += 1;
    } else if (a.referralId) {
      labels.push({
        id: a.referralId,
        name: a.referral.user.name,
        count: 1,
        color: generateRandomHexColor(),
      });
    }
  });
  labels.sort((a, b) => b.count - a.count);

  const data = {
    labels: labels.map((referral) => referral.name),
    datasets: [
      {
        label: "Indicados",
        data: labels.map((referral) => referral.count),
        backgroundColor: "rgba(79, 70, 229, 0.75)",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
