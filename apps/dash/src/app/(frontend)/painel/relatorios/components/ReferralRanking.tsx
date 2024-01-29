"use client";
import { generateRandomHexColor } from "@/app/(frontend)/_shared/utils/colors";
import { readSupportersFromSupporterGroupWithRelation } from "@/app/api/panel/supporters/service";
import { ExtractSuccessResponse } from "odinkit";
import { ChartContainer, createChart } from "odinkit/client";

interface ReferralRankingProps {
  supporters: ExtractSuccessResponse<
    typeof readSupportersFromSupporterGroupWithRelation
  >;
}

export function ReferralRanking({ supporters }: ReferralRankingProps) {
  const labels =
    supporters
      ?.reduce<{ id: string; name: string; count: number; color: string }[]>(
        (acc, { referralId, referral }) => {
          if (referralId) {
            const index = acc.findIndex((label) => label.id === referralId);
            index >= 0
              ? acc[index]!.count++
              : acc.push({
                  id: referralId,
                  name: referral?.user.name || "Anônimo",
                  count: 1,
                  color: generateRandomHexColor(),
                });
          }
          return acc;
        },
        []
      )
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) || [];

  const chart = createChart({
    type: "bar",

    data: {
      labels: labels.map((referral) => referral.name),
      datasets: [
        {
          label: "Indicados",
          data: labels.map((referral) => referral.count),
          backgroundColor: "rgba(79, 70, 229, 0.75)",
        },
      ],
    },
    options: {
      aspectRatio: 1.5,
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
    },
  });

  return <ChartContainer chart={chart} />;
}
