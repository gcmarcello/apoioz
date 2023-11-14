import { ErrorResponse, SuccessResponse } from "@/app/api/_shared/utils/ActionResponse";
import { useId } from "react";
import useSWRMutation from "swr/mutation";

interface UseActionParams<T, U, ParserReturnType> {
  onError?: (error: string | string[]) => void;
  onSuccess?: (res: SuccessResponse<U>) => void;
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

  const fetcher = async (arg: T) => {
    try {
      const actionRes = await action(arg);
      if ("error" in actionRes) {
        throw new Error(actionRes.message as string);
      }
      onSuccess && onSuccess(actionRes);
      return actionRes.data;
    } catch (error: any) {
      onError && onError(error);
      throw new Error(error);
    }
  };

  parser = parser || ((arg) => arg);

  const parsedFetcher = (arg: T) =>
    fetcher(arg).then((res) => parser(res) as ParserReturnType);

  return useSWRMutation<ParserReturnType, any, string, T>(id, (url: string, { arg }) =>
    parsedFetcher(arg)
  );
}
