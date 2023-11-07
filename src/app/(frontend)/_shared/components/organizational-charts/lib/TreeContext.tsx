import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { Campaign, Prisma, Supporter } from "@prisma/client";
import { LineStyles } from "./types";

export class TreeContextProps {
  lineStyles: LineStyles;
}

export const TreeContext = createContext(new TreeContextProps());
