"use client";
import { Date } from "@/app/(frontend)/_shared/components/Date";
import { CheckBadgeIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { RowSelection, createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import { DefaultTable } from "@/app/(frontend)/_shared/components/tables/table";
import { LoadingSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { Poll } from "@prisma/client";
import { ParagraphLink } from "@/app/(frontend)/_shared/components/text/ParagraphLink";
import { toProperCase } from "@/_shared/utils/format";
import { useState } from "react";
import SupporterBall from "@/app/(frontend)/_shared/components/SupporterBall";

export default function PollTable({ answers, poll }: { answers: any[]; poll }) {
  const columnHelper = createColumnHelper<any>();
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    columnHelper.accessor("supporter.user.name", {
      id: "name",
      header: "Nome",
      enableSorting: true,
      enableGlobalFilter: true,
      cell: (info) => (
        <>
          <div className="mt-1 flex items-center gap-x-1.5">
            <div className="flex">
              {info.row.original.supporter.level && (
                <SupporterBall level={info.row.original.supporter.level} />
              )}
            </div>
            {info.getValue()}
          </div>
        </>
      ),
    }),
    columnHelper.accessor("supporter.user.info.Section.Address.neighborhood", {
      id: "neighborhood",
      header: "Bairro",
      enableSorting: true,
      enableGlobalFilter: true,
      cell: (info) => toProperCase(info.getValue()),
    }),
  ];

  for (const question of poll.questions) {
    columns.push(
      columnHelper.accessor(`parsedAnswers.${question.questionId}`, {
        id: question.questionId,
        header: question.question,
        enableSorting: true,
        enableGlobalFilter: true,
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor(`parsedAnswers.${question.questionId}_freeAnswer`, {
        id: question.questionId + "_freeAnswer",
        header: "Comentários",
        enableSorting: true,
        enableGlobalFilter: true,
        cell: (info) => (
          <div className="max-w-[156px]">
            <p className="... truncate">{info.getValue()}</p>
          </div>
        ),
      })
    );
  }

  if (!answers || !poll)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <DefaultTable
      globalFilter={globalFilter}
      setGlobalFilter={setGlobalFilter}
      data={answers}
      columns={columns}
      count={answers.length}
    />
  );
}
