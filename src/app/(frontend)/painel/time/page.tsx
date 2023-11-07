import { listTreeSuporters } from "@/app/api/panel/supporters/actions";
import Image from "next/image";
import clsx from "clsx";
import { AtSymbolIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { toProperCase } from "@/(shared)/utils/format";
import { fetchCampaignTeamMembers } from "@/app/api/panel/campaigns/actions";
import WhatsAppIcon from "../../_shared/components/icons/WhatsAppIcon";
import { NoSsrTreeComponent } from "./components/TreeComponent/NoSsrTreeComponent";

export default async function TimePage() {
  const tree = await listTreeSuporters();

  if (!tree) return;

  return <NoSsrTreeComponent supportersTree={tree} />;
}
