import { TableCellsIcon } from "@heroicons/react/24/solid";
import { Button } from "./Button";
import xlsx from "json-as-xlsx";

export interface XlsxProps {
  data: any[];
  columns: any[];
  dataFormatter: (data: any) => any;
  fileName: string;
}

export default function Xlsx({ data, columns, dataFormatter }: XlsxProps) {
  let settings = {
    fileName: "MySpreadsheet", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
    RTL: false, // Display the columns from right-to-left (the default value is false)
  };
  const formattedData = dataFormatter ? data.map(dataFormatter) : data;

  return (
    <>
      <Button variant="excel" onClick={() => xlsx(formattedData, settings)}>
        <div className="flex items-center justify-center gap-2">
          <TableCellsIcon className="h-6 w-6 text-white" />
          <span className="-me-1 hidden lg:inline">Exportar para</span>Excel
        </div>
      </Button>
    </>
  );
}
