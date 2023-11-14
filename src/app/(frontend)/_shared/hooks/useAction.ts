import { ErrorResponse, SuccessResponse } from "@/app/api/_shared/utils/ActionResponse";
import { useId } from "react";
import useSWRMutation from "swr/mutation";

interface UseActionParams<T, U, ParserReturnType> {
  onError?: (error: string | string[]) => void;
  onSuccess?: (res: ParserReturnType) => void;
  action: (arg: T) => Promise<SuccessResponse<U> | ErrorResponse>;
  parser?: (arg: U) => ParserReturnType;
}

export function useAction<T, U extends ParserReturnType, ParserReturnType = U>({
  action,
  onSuccess,
  onError,
  parser = (arg) => arg,
}: UseActionParams<T, U, ParserReturnType>) {
  const id = useId();

  parser = parser || ((arg) => arg);

  const fetcher = (arg: T) =>
    action(arg)
      .then((res) => {
        if ("error" in res) {
          throw new Error(res.message as string);
        }
        const parsedData = parser(res.data);
        onSuccess && onSuccess(parsedData);
        return parsedData;
      })
      .catch((error: any) => {
        onError && onError(error);
        throw new Error(error);
      });

  return useSWRMutation<ParserReturnType, any, string, T>(id, (url: string, { arg }) =>
    fetcher(arg)
  );
}
