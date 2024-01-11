import {
  Input as HeadlessInput,
  type InputProps as HeadlessInputProps,
} from "@headlessui/react";
import React, { useMemo, useState } from "react";
import { Controller, useController, useFormContext } from "react-hook-form";
import { useField } from "./Form";
import { For } from "../For";
import clsx from "clsx";
import { FolderIcon } from "@heroicons/react/24/solid";

export function FileInput({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  fileIcon: React.ReactNode;
  fileTypes: string[];
  maxSize: number;
} & HeadlessInputProps) {
  const form = useFormContext();
  const { name } = useField();

  const {
    field,
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name: name,
    control: form.control,
    rules: { required: true },
    defaultValue: [],
  });

  const decodedImages = useMemo(
    () => Array.from(field.value).map((img: any) => URL.createObjectURL(img)),
    [field.value]
  );

  const removeImage = (index: number) => {
    const images = Array.from(field.value);
    images.splice(index, 1);
    field.onChange({
      target: {
        value: images,
      },
    });
  };

  return (
    <div className={clsx(className)}>
      <div
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const { files } = e.dataTransfer;
          field.onChange({
            target: {
              value: files,
            },
          });
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-6">
          <div className="text-center">
            {field.value.length > 0 ? (
              <FileList images={decodedImages} removeImage={removeImage} />
            ) : (
              <FileCTA
                fileIcon={props.fileIcon}
                fileTypes={props.fileTypes}
                maxSize={props.maxSize}
              />
            )}
          </div>
        </div>
      </div>
      <input
        hidden
        id="file-upload"
        type="file"
        {...field}
        accept={props.fileTypes?.join(",")}
        name={field.name}
        value={field.value.filename}
        onChange={(e) => field.onChange(e.target.files)}
      />
    </div>
  );
}

function FileList({
  images,
  removeImage,
}: {
  images: string[];
  removeImage: (index: number) => void;
}) {
  return (
    <div className="mt-3 flex gap-4">
      <For each={images} identifier="images">
        {(image, index) => (
          <div className="relative inline-block" key={`k-${index}`}>
            <img
              src={image}
              className="pointer-events-none h-24 w-full rounded-md"
              alt=""
              loading="lazy"
            />
            <div
              className="absolute left-0 top-0 h-6 w-6 rounded-full transition duration-150 ease-in-out hover:scale-125"
              onClick={() => {
                removeImage(index as number);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
              >
                <circle cx="10" cy="10" r="6" fill="white" />
                <path
                  fill="#D0342C"
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16a8 8 0 0 0 0 16ZM7 9a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H7Z"
                />
              </svg>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}

function FileCTA(props: {
  fileIcon: React.ReactNode;
  fileTypes: string[];
  maxSize: number;
}) {
  return (
    <>
      {props.fileIcon || <FolderIcon className="mx-auto h-12 w-12 text-gray-300" />}

      <div className="mt-4 flex text-sm leading-6 text-gray-600">
        <label
          htmlFor="file-upload"
          className="relative cursor-pointer rounded-md font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2 hover:text-emerald-500"
        >
          <span>Envie um arquivo</span>
        </label>
        <p className="pl-1">ou arraste</p>
      </div>
      <p className="text-xs leading-5 text-gray-600">
        {props.fileTypes?.map((t) => t.split("/")[1].toUpperCase()).join(", ") ??
          "Arquivos de qualquer tipo"}{" "}
        de até {props.maxSize}MB
      </p>
    </>
  );
}
