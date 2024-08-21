import { ReadonlyURLSearchParams } from "next/navigation";

export function parseSearchParams(searchParams: ReadonlyURLSearchParams) {
  const array = Array.from(searchParams);
  return array.filter(
    (param) => param[0] !== "page" && param[0] !== "take" && param[0] !== "skip"
  );
}
