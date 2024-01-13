import { Disclosure, Transition } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { scrollToElement } from "../utils/scroll";

export default function DisclosureAccordion({
  children,
  title,
  scrollToContent,
  defaultOpen,
}: {
  children: React.ReactNode;
  title: string;
  scrollToContent?: boolean;
  defaultOpen?: boolean;
}) {
  const contentRef = useRef(null);

  return (
    <Disclosure
      defaultOpen={defaultOpen}
      as="div"
      className="border-t border-gray-200 bg-transparent p-4 pe-2"
    >
      {({ open }) => {
        if (scrollToContent && contentRef.current)
          scrollToElement(contentRef.current, 0);
        return (
          <>
            <dt ref={contentRef}>
              <Disclosure.Button className="flex w-full items-center justify-between text-left text-gray-900">
                <span className="text-sm font-medium text-gray-900">
                  {title}
                </span>
                <span className="ml-6 flex h-7 items-center">
                  {open ? (
                    <MinusSmallIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <PlusSmallIcon className="h-6 w-6" aria-hidden="true" />
                  )}
                </span>
              </Disclosure.Button>
            </dt>
            <Transition
              unmount={false}
              as="dd"
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Disclosure.Panel unmount={false} as="div" className="mt-4">
                <div>{children}</div>
              </Disclosure.Panel>
            </Transition>
          </>
        );
      }}
    </Disclosure>
  );
}
