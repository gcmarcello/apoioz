export const getEnv = (key: string) => process.env[key];
export const compareEnv = (key: string, value: string) =>
  process.env[key] === value;

export const isDev = compareEnv("NODE_ENV", "development");
export const isProd = compareEnv("NODE_ENV", "production");
