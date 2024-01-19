import SupportersTable from "./components/SupportersTable";
import { SupportersLastMonth } from "./components/SupportersLastMonth";
import { ReferralRanking } from "./components/ReferralRanking";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import ReportsProvider from "./providers/ReportsProvider";
import Footer from "../_shared/components/Footer";
import Modal from "../../_shared/components/Modal";

export default function RelatoriosPage({}) {
  return (
    <>
      <ReportsProvider>
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
        <div className="grid grid-cols-1 md:grid-cols-5 lg:divide-x ">
          <div className="col-span-1 flex flex-col justify-evenly md:col-span-2 lg:px-4">
            <SupportersLastMonth />
            <ReferralRanking />
          </div>

          <div className="col-span-1 px-2 md:col-span-3 lg:pe-0 lg:ps-8">
            <SupportersTable />
          </div>
        </div>
      </ReportsProvider>
      <Footer />
    </>
  );
}
