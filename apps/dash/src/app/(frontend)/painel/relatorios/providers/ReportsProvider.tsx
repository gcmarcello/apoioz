"use client";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { ReportsContext } from "../contexts/reports.ctx";
import clsx from "clsx";
import { ArrowLeftIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useAction } from "odinkit/client";
import { readSupportersFromSupporterGroupWithRelation } from "@/app/api/panel/supporters/actions";

export default function ReportsProvider({ children }: { children: any }) {
  const [viewingAs, setViewingAs] = useState<any>(undefined);
  const [globalFilter, setGlobalFilter] = useState("");

  const {
    trigger: fetchSupporters,
    data,
    pagination,
  } = useAction({
    action: readSupportersFromSupporterGroupWithRelation,
  });

  const openAsSupporter = async (supporter: any) => {
    await fetchSupporters({ where: { supporterId: supporter.id } });
    setViewingAs(supporter);
    setGlobalFilter("");
  };

  const restoreView = async () => {
    await fetchSupporters();
    setViewingAs(undefined);
  };

  useEffect(() => {
    restoreView();
  }, []);

  return (
    <ReportsContext.Provider
      value={{
        supporters: {
          data,
          pagination,
        },
        openAsSupporter,
        restoreView,
        setViewingAs,
        viewingAs,
        globalFilter,
        setGlobalFilter,
      }}
    >
      <div
        className={clsx(viewingAs && "rounded-md border-4 border-orange-500")}
      >
        <div className={clsx(viewingAs && "m-4")}>
          {viewingAs && (
            <div className="my-4 flex items-center gap-x-2">
              <EyeIcon className="h-10 w-10 text-orange-500" />{" "}
              <span className="">
                Você está visualizando como{" "}
                <strong>{viewingAs.user.name}</strong>.{" "}
                <span
                  role="button"
                  onClick={() => restoreView()}
                  className="ms-1 inline-flex items-center font-bold text-orange-500 duration-200 hover:text-orange-600"
                >
                  Voltar <ArrowLeftIcon className="ms-1 inline h-5 w-5" />
                </span>
                {"  "}
              </span>
            </div>
          )}
        </div>
        {children}
      </div>
    </ReportsContext.Provider>
  );
}
