"use client";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { FieldValues, FormProps, UseFormReturn } from "react-hook-form";

export interface ListboxOptionType {
  id: string | number;
  name: string | number;
  value: any;
  disabled?: boolean;
}

export default function SelectListbox({
  options,
  label,
  formLabel,
  form,
  disabled,
  reverseOptions,
}: {
  options: ListboxOptionType[];
  label: string;
  formLabel: string;
  form: UseFormReturn<FieldValues, any, undefined>;
  disabled?: boolean;
  reverseOptions?: boolean;
}) {
  const handleChange = (value: any) => {
    const newSelected = options.find((option) => option.value === value);
    if (formLabel && form) form?.setValue(formLabel, newSelected);
  };

  return (
    <>
      <Listbox
        disabled={disabled}
        defaultValue={""}
        {...form.register(formLabel)}
        onChange={handleChange}
      >
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6 text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: label }}></div>
            </Listbox.Label>
            <div className="relative">
              <Listbox.Button
                className={clsx(
                  disabled ? "bg-gray-100" : "bg-white",
                  "relative min-h-[38px] w-full cursor-pointer rounded-md  py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                )}
              >
                <span className="block truncate">
                  {form.watch(formLabel)?.name || "Selecionar"}
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
                    reverseOptions && "-translate-y-full"
                  )}
                >
                  <Listbox.Option
                    key={"default"}
                    disabled
                    defaultChecked
                    className={({ active }) =>
                      clsx(
                        active ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-900",
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
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                  {options.map((item) => (
                    <Listbox.Option
                      key={item.id}
                      disabled={item.disabled}
                      className={({ active, disabled }) =>
                        clsx(
                          active
                            ? "bg-indigo-600 text-white"
                            : disabled
                            ? "bg-gray-100"
                            : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={item.value}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={clsx(
                              selected ? "font-semibold" : "font-normal",
                              "block truncate"
                            )}
                          >
                            {item.name}
                          </span>

                          {selected ? (
                            <span
                              className={clsx(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
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
        )}
      </Listbox>
    </>
  );
}
