import { useContext } from "react";
import { ReportsContext } from "../contexts/reports.ctx";

export const useReports = () => {
  const reportsContext = useContext(ReportsContext);

  return reportsContext;
};
