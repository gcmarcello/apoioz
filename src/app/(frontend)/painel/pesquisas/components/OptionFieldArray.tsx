import { TextField } from "@/app/(frontend)/_shared/components/fields/Text";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useFieldArray } from "react-hook-form";

export default function OptionFieldArray({ nestIndex, control, form }) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `test.${nestIndex}.nestedArray`,
  });

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <div className="ml-5 mt-3 flex items-end" key={item.id}>
            <TextField
              label={`Opção ${k}`}
              hform={form}
              name={`test.${nestIndex}.nestedArray.${k}.field1` as const}
            />
            <button
              type="button"
              className="relative inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-1.5 text-sm font-semibold text-gray-900"
              onClick={() => remove(k)}
            >
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() =>
          append({
            field1: "field1",
          })
        }
      >
        Append Nested
      </button>

      <hr />
    </div>
  );
}
