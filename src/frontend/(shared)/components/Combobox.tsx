"use client";
import {
  CheckIcon,
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Combobox } from "@headlessui/react";
import clsx from "clsx";

export default function ComboboxInput<T>({
  rawData = [],
  disabled,
  onChange,
  value,
  displayValueKey,
  reverseOptions,
}: {
  rawData: any[] | undefined;
  disabled?: boolean;
  onChange: any;
  value: any;
  displayValueKey: string;
  reverseOptions?: boolean;
}) {
  const data = rawData.map((i) => ({
    id: i.id as string,
    displayValue: i[displayValueKey] as string,
  }));

  value = data.find((i) => i.id === value);

  type DataType = (typeof data)[0];

  const [query, setQuery] = useState("");
  const [selectedData, setSelectedData] = useState<DataType>();

  const filteredData =
    query === ""
      ? data
      : data.filter((dataItem: any) => {
          return dataItem.displayValue
            .toString()
            .toLowerCase()
            .includes(query.toLowerCase());
        });

  return (
    <Combobox
      disabled={disabled}
      as="div"
      value={value || ""}
      onChange={(data) => {
        setSelectedData(data);
        onChange(data);
      }}
    >
      <div className="relative mt-2">
        <Combobox.Input
          inputMode="numeric"
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          displayValue={(item: DataType) => {
            return item.displayValue;
          }}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {filteredData.length > 0 && (
          <Combobox.Options
            className={clsx(
              "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
              filteredData.length === 1 ? "" : "top-[-15.55rem] "
            )}
          >
            {filteredData.map((data) => (
              <Combobox.Option
                key={data.id}
                value={data || {}}
                className={({ active }) =>
                  clsx(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-indigo-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={clsx("block truncate", selected && "font-semibold")}>
                      {data.displayValue}
                    </span>

                    {selected && (
                      <span
                        className={clsx(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
