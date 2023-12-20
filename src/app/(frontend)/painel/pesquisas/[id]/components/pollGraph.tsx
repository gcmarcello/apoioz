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
import { Chart } from "chart.js/dist";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";

export default function QuestionGraph({ question }: { question: any }) {
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const options = {
    responsive: true,
    indexAxis: "x" as const,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        color: "rgb(55 65 81)",
        text: question.question,
        font: {
          size: 20,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const voteCounts = {};
  question.answers.forEach((answer) => {
    answer.options.forEach((option) => {
      if (voteCounts[option.id]) {
        voteCounts[option.id].count += 1;
      } else {
        voteCounts[option.id] = {
          name: option.name,
          count: 1,
          color: generateRandomHexColor(), // Assuming you have a function to generate colors
        };
      }
    });
  });

  const data = {
    labels: Object.values(voteCounts).map((option) => (option as any).name as any),
    datasets: [
      {
        label: "Votos",
        data: Object.values(voteCounts).map((option) => (option as any).count),
        backgroundColor: Object.values(voteCounts).map(
          (option) => (option as any).color as any
        ),
      },
    ],
  };

  return <Bar options={options} data={data} />;
}
