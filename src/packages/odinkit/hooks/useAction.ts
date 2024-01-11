import { ErrorResponse, SuccessResponse } from "../api/ActionResponse";
import { useId } from "react";
import useSWRMutation from "swr/mutation";

type FetcherResponse<T> = Promise<T>;

interface UseActionParams<
  ArgumentType,
  DataReturnType,
  RequestParserReturnType,
  ResponseParserReturnType,
> {
  defaultData?: ResponseParserReturnType;
  onError?: (error: string) => void;
  onSuccess?: (res: SuccessResponse<ResponseParserReturnType>) => void;
  responseParser?: (arg: DataReturnType) => ResponseParserReturnType;
  requestParser?: (arg: ArgumentType) => RequestParserReturnType;
  action: (
    arg: RequestParserReturnType | ArgumentType
  ) => Promise<SuccessResponse<DataReturnType> | ErrorResponse | void>;
  redirect?: boolean;
}

export function useAction<
  ArgumentType,
  DataReturnType,
  RequestParserReturnType = ArgumentType,
  ResponseParserReturnType = DataReturnType,
>({
  defaultData,
  action,
  onSuccess,
  onError,
  requestParser,
  responseParser,
  redirect = false,
}: UseActionParams<
  ArgumentType,
  DataReturnType,
  RequestParserReturnType,
  ResponseParserReturnType
>) {
  const id = useId();

  const fetcher = (
    arg: ArgumentType
  ): FetcherResponse<SuccessResponse<ResponseParserReturnType>> => {
    const formattedArg = requestParser ? requestParser(arg) : arg;

    return action(formattedArg)
      .then((res) => {
        if (res && "error" in res) throw res.message;

        if (redirect)
          return {
            data: null as ResponseParserReturnType,
            message: `Redirecionando...`,
          };

        if (!res) throw "Resposta indefinida.";

        if (!res.data) throw "Resposta sem dados.";

        const parsedData = (
          responseParser ? responseParser(res.data) : res.data
        ) as ResponseParserReturnType;

        return {
          data: parsedData,
          pagination: res.pagination,
          message: res.message,
        };
      })
      .catch((error) => {
        throw error;
      });
  };

  const mutation = useSWRMutation<
    SuccessResponse<ResponseParserReturnType>,
    string,
    string,
    ArgumentType
  >(id, (url: string, { arg }) => fetcher(arg), {
    onSuccess: (data) => onSuccess && onSuccess(data),
    onError: (error) => onError && onError(error),
  });

  const actionResult = {
    ...mutation,
    data: (mutation?.data?.data || defaultData) as ResponseParserReturnType,
    pagination: mutation?.data?.pagination,
  };

  return actionResult;
}
