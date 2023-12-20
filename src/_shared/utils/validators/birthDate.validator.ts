import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

export function birthDateValidator(data: string) {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const isValid = dateRegex.test(data as string);

  if (!isValid) return false;

  const minAge = 16;
  const maxAge = 120;

  const today = dayjs();
  const birthDate = dayjs(data, "DD/MM/YYYY");

  const isBetween = birthDate.isBetween(
    today.subtract(maxAge, "year"),
    today.subtract(minAge, "year")
  );

  return isBetween;
}
