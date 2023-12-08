import { Pagination } from "@/app/api/_shared/dto/read";
import {
  ActionResponseType,
  ErrorResponse,
  SuccessResponse,
} from "@/app/api/_shared/utils/ActionResponse";
import { type } from "os";
import { useId } from "react";
import useSWRMutation from "swr/mutation";
import { ParseReturnType } from "zod";

interface UseActionParams<
  ArgumentType,
  DataReturnType,
  FormatterReturnType,
  ParserReturnType,
> {
  defaultData?: ParserReturnType;
  onError?: (error: string | string[]) => void;
  onSuccess?: (res: SuccessResponse<ParserReturnType>) => void;
  parser?: (arg: DataReturnType) => ParserReturnType;
  formatter?: (arg: ArgumentType) => FormatterReturnType;
  action: (
    arg: FormatterReturnType
  ) => Promise<SuccessResponse<ParserReturnType> | ErrorResponse>;
}

export function useAction<
  ArgumentType,
  DataReturnType,
  FormatterReturnType,
  ParserReturnType extends DataReturnType,
>({
  defaultData,
  action,
  onSuccess,
  onError,
  formatter,
  parser,
}: UseActionParams<ArgumentType, DataReturnType, FormatterReturnType, ParserReturnType>) {
  const id = useId();

  const fetcher = (arg: ArgumentType) => {
    if (!action) throw "Action is not defined";

    const formattedArg = formatter(arg);

    return action(formattedArg)
      .then((res) => {
        if ("error" in res) {
          throw res.message;
        }
        return {
          data: parser ? parser(res.data) : res.data,
          pagination: res.pagination,
          message: res.message,
        };
      })
      .catch((error: any) => {
        throw error;
      });
  };

  const mutation = useSWRMutation<
    SuccessResponse<ParserReturnType>,
    any,
    string,
    ArgumentType
  >(id, (url: string, { arg }) => fetcher(arg), {
    onSuccess: (data) => onSuccess && onSuccess(data),
    onError: (error) => onError && onError(error),
  });

  const actionResult = {
    ...mutation,
    data: mutation?.data?.data || defaultData,
    pagination: mutation?.data?.pagination,
  };

  return actionResult;
}
