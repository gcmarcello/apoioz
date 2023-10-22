import { Dispatch, createContext, useContext, useState } from "react";
import { Prisma, Supporter } from "@prisma/client";
import { UserType } from "@/(shared)/types/userTypes";

export class PanelContextProps {
  updatingLatestSupporters: boolean = false;
  supporter: Supporter | undefined = undefined;
  setUpdatingLatestSupporters: Dispatch<boolean> = () => {};
  showToast: {
    show: boolean;
    variant?: "success" | "error" | "alert" | "";
    title: string;
    message: string;
  } = {
    show: false,
    variant: "",
    title: "",
    message: "",
  };
  setShowToast: Dispatch<{
    show: boolean;
    variant: "success" | "error" | "alert" | "";
    title: string;
    message: string;
  }> = () => {};
  fetchLatestSupporters: (userId: string, campaignId: string) => any = () => {};
  siteURL: string = "";
  user: Omit<Prisma.UserGetPayload<{ include: { info: true } }>, "password">;
  campaign: any = null;
  setCampaign: Dispatch<any> = () => {};
}

export const PanelContext = createContext(new PanelContextProps());
