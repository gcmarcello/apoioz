import { useState, useTransition } from "react";

export function useActionState<Params extends any[], Result>(
  action: (...args: Params) => Promise<Result>
) {
  const [loading, startTransition] = useTransition();
  const [error, setError] = useState<any>();
  const [data, setData] = useState<Result | undefined>();

  const run = (...args: Params): Promise<{ data?: Result; error?: Error }> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          setError(undefined);
          const result = await action(...args);
          setData(result);
          resolve({ data: result });
        } catch (error: any) {
          setError(error);
          setData(undefined);
          resolve({ error });
        }
      });
    });
  };

  return { run, loading, error, data };
}
