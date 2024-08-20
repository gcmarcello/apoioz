"use client";
import ReportProvider, { SupporterWithReferral } from "./context/report.ctx";
import { Address, Section, Zone } from "prisma/client";
import ReportHeader from "./components/ReportHeader";
import ReportsTable from "./components/ReportsTable";
import { Container } from "odinkit";
import EditSupporterModal from "./components/EditSupporterModal";
import { Form, useForm } from "odinkit/client";
import { updateSupporterDto } from "@/app/api/panel/supporters/dto";
import { SupportersLastMonth } from "./components/SupportersLastMonth";
import { ReferralRanking } from "./components/ReferralRanking";

export default function ReportsPage(props: {
  addresses: Address[];
  zones: Zone[];
  sections: Section[];
  seeingAs?: SupporterWithReferral;
  supporters: SupporterWithReferral[];
}) {
  return (
    <ReportProvider {...props}>
      <Container>
        <EditSupporterModal />
        <ReportHeader />
        <ReportsTable />
        <div className="grid grid-cols-2 lg:divide-x ">
          <div className="col-span-2 flex  justify-evenly md:col-span-1 lg:px-4 lg:py-2">
            <SupportersLastMonth supporterData={props.supporters} />
          </div>
          <div className="col-span-2 flex  justify-evenly md:col-span-1 lg:px-4  lg:py-2">
            <ReferralRanking supporters={props.supporters} />
          </div>
        </div>
      </Container>
    </ReportProvider>
  );
}
