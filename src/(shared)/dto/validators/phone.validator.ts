export function phoneValidator(data: string) {
  const phoneRegex = /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/;
  return phoneRegex.test(data as string);
}
