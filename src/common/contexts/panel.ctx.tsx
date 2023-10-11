import { Dispatch, createContext, useContext, useState } from "react";
import { UserType } from "../types/userTypes";

export class PanelContextProps {
  updatingLatestSupporters: boolean = false;
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
  user: UserType = {
    email: "",
    name: "",
    id: "",
    role: "",
    info: {
      cityId: "",
      phone: "",
      sectionId: "",
      zoneId: "",
    },
  };
  campaign: any = null;
  setCampaign: Dispatch<any> = () => {};
}

export const PanelContext = createContext(new PanelContextProps());
