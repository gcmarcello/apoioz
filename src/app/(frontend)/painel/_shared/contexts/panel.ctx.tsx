import { Dispatch, createContext, useContext, useState } from "react";
import { Prisma, Supporter } from "@prisma/client";
import { UserType } from "@/(shared)/types/userTypes";

export class PanelContextProps {
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
  siteURL: string = "";
  user: Omit<Prisma.UserGetPayload<{ include: { info: true } }>, "password">;
  campaign: any = null;
  setCampaign: Dispatch<any> = () => {};
  supporter: Supporter | undefined = undefined;
}

export const PanelContext = createContext(new PanelContextProps());
