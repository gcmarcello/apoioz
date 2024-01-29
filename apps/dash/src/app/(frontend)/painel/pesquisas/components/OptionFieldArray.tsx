import { TextField } from "@/app/(frontend)/_shared/components/fields/Text";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/24/solid";
import { Control, UseFormReturn, useFieldArray } from "react-hook-form";
import { Button, IconOnlyButton } from "../../../_shared/components/Button";
import SwitchInput from "@/app/(frontend)/_shared/components/fields/Switch";
import { Poll } from "prisma/client";

export default function OptionFieldArray({
  nestIndex,
  form,
}: {
  nestIndex: number;
  form: UseFormReturn<any, any, undefined>;
}) {
  const { fields, remove, append, move } = useFieldArray<Poll>({
    control: form.control,
    name: `questions.${nestIndex}.options` as never, //@todo
  });

  let pseudoIndex = 0;

  return (
    <div>
      {fields.map((item, k) => {
        if (!form.watch(`questions.${nestIndex}.options.${k}.active`))
          return null;
        pseudoIndex++;
        return (
          <div className="mx-3 mt-3 flex items-end lg:mx-5" key={item.id}>
            <div className="flex-grow">
              <TextField
                label={`Opção ${pseudoIndex}`}
                hform={form}
                placeholder="Digite a opção"
                name={`questions.${nestIndex}.options.${k}.name` as const}
              />
            </div>
            <IconOnlyButton
              icon={XCircleIcon}
              onClick={() => {
                if (fields.length <= 1) {
                  form.setValue(`questions.${nestIndex}.allowFreeAnswer`, true);
                }
                if (form.getValues(`questions.${nestIndex}.options.${k}.id`)) {
                  form.setValue(
                    `questions.${nestIndex}.options.${k}.active`,
                    false
                  );
                } else {
                  remove(k);
                }
              }}
              className="mx-2 my-1 h-8 w-8"
              iconClassName={"text-red-600"}
            />

            <IconOnlyButton
              icon={ArrowUpIcon}
              disabled={k === 0}
              onClick={() => move(k, k - 1)}
              className="my-1.5 h-8 w-8"
              iconClassName={
                k === 0 ? "text-gray-300 sw-2" : "text-gray-600 sw-2"
              }
            />

            <IconOnlyButton
              icon={ArrowDownIcon}
              disabled={k === fields.length - 1}
              onClick={() => {
                move(k, k + 1);
              }}
              className="my-1.5 h-8 w-8"
              iconClassName={
                k === fields.length - 1
                  ? "text-gray-300 sw-2"
                  : "text-gray-600 sw-2"
              }
            />
          </div>
        );
      })}
      <div className="my-3 flex">
        <Button
          onClick={() => {
            append({
              name: "",
              active: true,
            });
          }}
          className="flex-grow lg:ml-5 lg:flex-grow-0"
          variant="primary"
        >
          <div className="flex items-center justify-center gap-x-2">
            Adicionar Opção <PlusCircleIcon className="h-6 w-6" />
          </div>
        </Button>
      </div>
      <hr className="my-4 " />
    </div>
  );
}
