import { SupportersLastMonth } from "./components/SupportersLastMonth";
import { ReferralRanking } from "./components/ReferralRanking";
import {
  ArrowLeftIcon,
  EyeIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";
import Footer from "../_shared/components/Footer";
import { readSupportersFromSupporterGroupWithRelation } from "@/app/api/panel/supporters/service";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { SupporterSessionMiddleware } from "@/middleware/functions/supporterSession.middleware";
import { z } from "zod";
import { Container } from "odinkit";
import clsx from "clsx";
import { ViewAsButton } from "./components/ViewAsButton";
import { ReportsTable } from "./components/ReportsTable";

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: {
    as: string;
  };
}) {
  const {
    request: { supporterSession },
  } = await UseMiddlewares()
    .then(UserSessionMiddleware)
    .then(SupporterSessionMiddleware);

  const as = searchParams.as;

  const supporters = await readSupportersFromSupporterGroupWithRelation({
    supporterSession,
    where: {
      supporterId: z.string().uuid().safeParse(as) ? as : undefined,
    },
  });

  const seeingAs = supporters.data.find((supporter) => supporter.id === as);

  return (
    <Container
      className={clsx(seeingAs && "rounded-md border-4 border-orange-500")}
    >
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
        <div className="grid grid-cols-1 md:grid-cols-5 lg:divide-x ">
          <div className="col-span-1 flex flex-col justify-evenly md:col-span-2 lg:px-4">
            <SupportersLastMonth supporterData={supporters.data} />
            <ReferralRanking supporters={supporters.data} />
          </div>

          <Container
            className={"col-span-1 px-2 md:col-span-3 lg:pe-0 lg:ps-8"}
          >
            <ReportsTable supporters={supporters.data} />
          </Container>
        </div>
      </Container>

      <Footer />
    </Container>
  );
}
