export const getEntryFromPath = (obj: any, path: string, extraKey: string = "") => {
  const pathArray = path.split(".");

  const entryValue = pathArray.reduce((acc, curr) => {
    const nextAcc = acc && acc[curr];

    if (!nextAcc) return null;

    if (typeof nextAcc === "object" && extraKey in nextAcc) {
      return nextAcc[extraKey];
    }

    return nextAcc;
  }, obj);

  const entryKey = path.split(".").pop();
  return {
    entryKey,
    entryValue,
  };
};
