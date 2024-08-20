"use client";
import { Container } from "odinkit";
import { useReport } from "../context/report.ctx";
import {
  EyeIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";
import clsx from "clsx";
import { ViewAsButton } from "./ViewAsButton";

export default function ReportHeader() {
  const { seeingAs } = useReport();
  return (
    <Container className={clsx(seeingAs && "m-4")}>
      {seeingAs && (
        <Container className="my-4 flex items-center gap-x-2">
          <EyeIcon className="h-10 w-10 text-orange-500" />{" "}
          <span>
            Você está visualizando como <strong>{seeingAs.user.name}</strong>.{" "}
            <ViewAsButton className="ms-1 inline-flex items-center font-bold text-orange-500 duration-200 hover:text-orange-600">
              Voltar <ArrowLeftIcon className="ms-1 inline h-5 w-5" />
            </ViewAsButton>
          </span>
          <div className="mx-4 mb-4 flex text-sm text-gray-600">
            <InformationCircleIcon className="me-1 h-5 w-5" />
            Nessa página você tem acesso a todos os apoiadores da sua rede.{" "}
            {/* <span
            className="ms-1 font-bold text-indigo-600 hover:text-indigo-400"
            role="button"
            onClick={() => setOpen(true)}
          >
            Como funciona?
          </span> */}
          </div>
        </Container>
      )}
    </Container>
  );
}
