import { Disclosure, Transition } from "@headlessui/react";
import { MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { scrollToElement } from "../utils/scroll";

export default function DisclosureAccordion({ children, title, scrollToContent }) {
  const contentRef = useRef(null);

  return (
    <Disclosure as="div" className="pt-4">
      {({ open }) => {
        if (scrollToContent && contentRef.current) scrollToElement(contentRef.current, 0);
        return (
          <>
            <dt ref={contentRef}>
              <Disclosure.Button className="flex w-full items-start justify-between text-left text-gray-900">
                <span className="text-base font-semibold leading-7">{title}</span>
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
