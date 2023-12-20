"use client";
import { generateRandomHexColor } from "@/app/(frontend)/_shared/utils/colors";
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
import { Bar } from "react-chartjs-2";
import { useReports } from "../hooks/useReports";

export function ReferralRanking() {
  const { supporters } = useReports();
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
  supporters.data?.forEach((supporter) => {
    if (supporter.referralId && labels.find((ref) => ref.id === supporter.referralId)) {
      labels.find((ref) => ref.id === supporter.referralId).count += 1;
    } else if (supporter.referralId) {
      labels.push({
        id: supporter.referralId,
        name: supporter.referral?.user.name,
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

  return <Bar options={options as any} data={data} />;
}
