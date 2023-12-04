"use client";
import { Date } from "@/app/(frontend)/_shared/components/Date";
import SupporterBall from "../../time/components/SupporterBall";
import { PollsTableType } from "@/_shared/types/tableTypes";
import { AtSymbolIcon, CheckBadgeIcon, TvIcon } from "@heroicons/react/24/solid";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";
import WhatsAppIcon from "@/app/(frontend)/_shared/components/icons/WhatsAppIcon";
import { DefaultTable } from "@/app/(frontend)/_shared/components/tables/table";
import { EyeIcon } from "@heroicons/react/24/outline";
import { LoadingSpinner } from "@/app/(frontend)/_shared/components/Spinners";
import { Poll, PollQuestion } from "@prisma/client";
import { ParagraphLink } from "@/app/(frontend)/_shared/components/text/ParagraphLink";

export default function PollsTable({ polls }: { polls: Poll[] }) {
  const columnHelper = createColumnHelper<PollsTableType>();

  const columns = [
    columnHelper.accessor("title", {
      id: "title",
      header: "Nome",
      enableSorting: true,
      enableGlobalFilter: true,
      cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("createdAt", {
      id: "createdAt",
      header: "Criada em",
      cell: (info) => <Date value={dayjs(info.getValue()).format("DD/MM/YYYY HH:mm")} />,
    }),

    columnHelper.accessor("PollQuestion", {
      id: "questionNumber",
      header: "Perguntas",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("PollAnswer", {
      id: "optionNumber",
      header: "Respostas",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("activeAtSignUp", {
      id: "activeAtSignUp",
      header: "Principal",
      cell: (info) =>
        info.getValue() ? (
          <div className="flex justify-center">
            <CheckBadgeIcon className="h-6 w-6 text-indigo-600" />
          </div>
        ) : null,
    }),
    columnHelper.accessor("id", {
      id: "edit",
      header: "",
      cell: (info) => (
        <ParagraphLink href={`./pesquisas/${info.getValue()}`}>Editar</ParagraphLink>
      ),
    }),
  ];

  if (!polls)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  return <DefaultTable data={polls} columns={columns} count={polls.length} />;
}
