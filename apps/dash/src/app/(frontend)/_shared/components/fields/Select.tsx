import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import { Combobox, Listbox, Transition } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/solid";
import { BaseProps, Field, fieldClasses, getErrorMessage } from "./Field";
import { Controller, FieldValues, Path } from "react-hook-form";
import { useAction } from "odinkit/client";
import {
  ErrorResponse,
  SuccessResponse,
} from "@/app/api/_shared/utils/ActionResponse";
import { ButtonSpinner } from "../Spinners";
import { ActionResponseType } from "odinkit";

type SelectFieldProps<
  Fields extends FieldValues,
  Data extends Array<{ [key: string]: any }>,
> = BaseProps<Fields> & {
  data?: Data | undefined[];
  displayValueKey: Path<Data[0]>;
  valueKey?: Path<Data[0]>;
  onChange?: (value: any) => void;
  reverseOptions?: boolean;
};

export function ListboxField<
  Fields extends FieldValues,
  Data extends Array<{ [key: string]: any }>,
>({ hform, name, data, ...props }: SelectFieldProps<Fields, Data>) {
  const id = useId();

  const errorMessage = getErrorMessage(hform, name);

  const options = (data || []).map((i) => ({
    id: i?.id as string,
    value: i?.[(props.valueKey as string) || "id"] as string,
    displayValue: i?.[props.displayValueKey as string] as string,
  }));

  return (
    <Controller
      name={name}
      control={hform.control}
      render={({ field: { onChange, value } }) => (
        <Field errorMessage={errorMessage} label={props.label} id={id}>
          <Listbox
            disabled={props.disabled}
            as={Fragment}
            value={value || ""}
            onChange={(data: any) => {
              props.onChange && props.onChange(data);
              onChange(data.value);
            }}
          >
            {({ open, disabled, value }) => {
              const selectedOption = options?.find(
                (o) => o.value === value
              )?.displayValue;

              return (
                <>
                  <div className="relative mt-2">
                    <Listbox.Button
                      className={clsx(
                        disabled ? "bg-gray-100" : "bg-white",
                        "relative w-full cursor-pointer rounded-md  py-1.5 pl-3 pr-10 text-left text-gray-900",
                        fieldClasses
                      )}
                    >
                      <span className="block truncate">
                        {selectedOption || "Selecionar"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>

                    <Transition
                      show={open}
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options
                        className={clsx(
                          "absolute z-10 mt-1 max-h-60 w-full  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
                          props.reverseOptions && "-translate-y-full"
                        )}
                      >
                        <Listbox.Option
                          key={"default"}
                          disabled
                          defaultChecked
                          className={({ active }) =>
                            clsx(
                              active
                                ? "bg-rose-600 text-white"
                                : "bg-gray-100 text-gray-900",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={null}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={clsx(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                Selecionar
                              </span>

                              {selected ? (
                                <span
                                  className={clsx(
                                    active ? "text-white" : "text-rose-600",
                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                        {options.map((item) => (
                          <Listbox.Option
                            key={item.id}
                            value={item || {}}
                            className={({ active, disabled }) =>
                              clsx(
                                active
                                  ? "bg-rose-600 text-white"
                                  : disabled
                                    ? "bg-gray-100"
                                    : "text-gray-900",
                                "relative cursor-default select-none py-2 pl-3 pr-9"
                              )
                            }
                          >
                            {({ selected, active }) => (
                              <>
                                <span
                                  className={clsx(
                                    selected ? "font-semibold" : "font-normal",
                                    "block truncate"
                                  )}
                                >
                                  {item.displayValue}
                                </span>

                                {selected ? (
                                  <span
                                    className={clsx(
                                      active ? "text-white" : "text-rose-600",
                                      "absolute inset-y-0 right-0 flex items-center pr-4"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </>
              );
            }}
          </Listbox>
        </Field>
      )}
    />
  );
}

export function ComboboxField<
  Fields extends FieldValues,
  Data extends { [key: string]: any }[],
>({
  data = [],
  fetcher,
  debounce = 500,
  ...props
}: SelectFieldProps<Fields, Data> & {
  fetcher?: (query: any) => Promise<ActionResponseType<Data>>;
  debounce?: number;
}) {
  const id = useId();

  const generateOptions = useCallback(
    (data: any) =>
      data.map((i: any) => {
        return {
          id: i.id as string,
          displayValue: (props.displayValueKey as string)
            .split(".")
            .reduce((acc, part) => acc && acc[part], i),
        };
      }),
    [props.displayValueKey]
  );

  const [initialOptions, setInitialOptions] = useState(generateOptions(data));

  useEffect(() => {
    const newOptions = generateOptions(data);
    if (
      JSON.stringify(newOptions) !== JSON.stringify(initialOptions) ||
      (newOptions.length === 0 && initialOptions.length !== 0)
    ) {
      setInitialOptions(newOptions);
    }
  }, [data, initialOptions, generateOptions]);

  const [query, setQuery] = useState("");

  const {
    data: fetchedData,
    trigger: fetchData,
    isMutating,
  } = useAction({
    action: fetcher as any,
  });

  const options = useMemo(() => {
    if (fetcher) {
      if (!fetchedData) return [];
      const options = generateOptions(fetchedData);
      if (!initialOptions) setInitialOptions(options);
      return options;
    }

    return query === ""
      ? initialOptions
      : generateOptions(data).filter((option: any) =>
          option.displayValue
            .toString()
            .toLowerCase()
            .includes(query.toLowerCase())
        );
  }, [fetchedData, initialOptions, query]);

  useEffect(() => {
    if (!fetcher) return;
    if (query === "") {
      fetchData({
        pagination: {
          pageSize: 10,
          pageIndex: 0,
        },
      });
    } else {
      const queryObject = props.displayValueKey
        .split(".")
        .reduceRight((acc: any, key: any) => ({ [key]: acc }), query);

      fetchData({
        where: queryObject,
      });
    }
  }, [query]);

  const timeout = useRef(setTimeout(() => {}, 0));

  const errorMessage = getErrorMessage(props.hform, props.name);

  return (
    <Controller
      name={props.name}
      control={props.hform.control}
      render={({ field: { onChange, value } }) => (
        <Field errorMessage={errorMessage} label={props.label} id={id}>
          <Combobox
            disabled={props.disabled}
            as={Fragment}
            value={options?.find((o: any) => o.id === value) || ""}
            onChange={(data: any) => {
              props.onChange && props.onChange(data);
              onChange(data.id);
            }}
          >
            <div className="relative mt-2">
              <Combobox.Input
                className={fieldClasses}
                onChange={(event) => {
                  if (!fetcher) {
                    setQuery(event.target.value);
                  } else {
                    clearTimeout(timeout.current);

                    timeout.current = setTimeout(() => {
                      setQuery(event.target.value);
                    }, debounce);
                  }
                }}
                displayValue={(item: any) => {
                  return item.displayValue;
                }}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                {isMutating ? (
                  <ButtonSpinner />
                ) : (
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </Combobox.Button>

              {options.length > 0 && (
                <Combobox.Options
                  className={clsx(
                    "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                  )}
                >
                  {options.map((data: any) => (
                    <Combobox.Option
                      key={data.id}
                      value={data || {}}
                      className={({ active }) =>
                        clsx(
                          "relative cursor-default select-none py-2 pl-3 pr-9",
                          active ? "bg-rose-600 text-white" : "text-gray-900"
                        )
                      }
                    >
                      {({ active, selected }) => (
                        <>
                          <span
                            className={clsx(
                              "block truncate",
                              selected && "font-semibold"
                            )}
                          >
                            {data.displayValue}
                          </span>

                          {selected && (
                            <span
                              className={clsx(
                                "absolute inset-y-0 right-0 flex items-center pr-4",
                                active ? "text-white" : "text-rose-600"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
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
        </Field>
      )}
    />
  );
}
