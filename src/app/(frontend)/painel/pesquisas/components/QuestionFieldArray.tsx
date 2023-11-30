import { useFieldArray } from "react-hook-form";
import OptionFieldArray from "./OptionFieldArray";
import { TextField } from "@/app/(frontend)/_shared/components/fields/Text";
import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "../../_shared/components/button";

export default function QuestionFieldArray({ form }) {
  const { fields, append, remove, prepend } = useFieldArray({
    control: form.control,
    name: "test",
  });

  return (
    <>
      <div className="flex justify-end">
        <Button
          onClick={() =>
            append({
              name: "useFieldArray" + (fields.length + 1),
              nestedArray: [{ field1: "field1", field2: "field2" }],
            })
          }
          variant="primary"
        >
          <div className="flex items-center justify-center gap-x-2">
            Adicionar Pergunta <PlusCircleIcon className="h-6 w-6" />
          </div>
        </Button>
      </div>
      {fields.map((item, index) => {
        return (
          <div key={item.id}>
            <div className="flex items-end ">
              <TextField
                label="Pergunta"
                hform={form}
                name={`test.${index}.name` as const}
              />
              <button
                type="button"
                className="relative inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-1.5 text-sm font-semibold text-gray-900"
                onClick={() => remove(index)}
              >
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </button>
            </div>
            <div>
              <OptionFieldArray
                nestIndex={index}
                form={form}
                {...{ control: form.control, register: form.register }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
