import { TableCellsIcon } from "@heroicons/react/24/solid";
import { Button } from "./Button";
import xlsx from "json-as-xlsx";
import { get } from "http";

export interface XlsxProps {
  data: any[];
  columns: any[];
  fileName: string;
}

export default function Xlsx({ data, columns, fileName }: XlsxProps) {
  let settings = {
    fileName: fileName,
    extraLength: 3,
    writeMode: "writeFile",
    writeOptions: {},
    RTL: false,
  };
  const parsedColumns = columns.map((column, index, array) => ({
    label:
      column.header === "Comentários"
        ? columns[index - 1].header + ": Comentarios"
        : column.header,
    key: `${column.accessorKey}`,
    value: `${column.accessorKey}`.replace(/\./g, ""),
  }));

  function getNestedProperty(obj, path) {
    if (typeof path === "string") {
      path = path.split(".");
    }

    return path.reduce((current, key) => {
      return current ? current[key] : undefined;
    }, obj);
  }

  function dataFormatter(data: any) {
    const formattedData = data.map((row) => {
      const formattedRow: any = {};
      parsedColumns.forEach((column) => {
        const value = getNestedProperty(row, column.key);
        formattedRow[column.value] = value;
      });
      return formattedRow;
    });

    return formattedData;
  }

  function excelObjectBuilder(data, columns) {
    console.log([{ sheet: "test", columns, content: dataFormatter(data) }]);
    return [{ sheet: "test", columns, content: dataFormatter(data) }];
  }

  return (
    <>
      <Button
        variant="excel"
        onClick={() => xlsx(excelObjectBuilder(data, parsedColumns), settings)}
      >
        <div className="flex items-center justify-center gap-2">
          <TableCellsIcon className="h-6 w-6 text-white" />
          <span className="-me-1 hidden lg:inline">Exportar para</span>Excel
        </div>
      </Button>
    </>
  );
}
