import { useFieldArray } from "react-hook-form";
import OptionFieldArray from "./OptionFieldArray";

export default function QuestionFieldArray({ form }) {
  const { fields, append, remove, prepend } = useFieldArray({
    control: form.control,
    name: "test",
  });

  return (
    <>
      {fields.map((item, index) => {
        return (
          <li key={item.id}>
            <input {...form.register(`test.${index}.name`)} />

            <button type="button" onClick={() => remove(index)}>
              Delete
            </button>
            <button
              type="button"
              onClick={() =>
                append({
                  name: "useFieldArray" + (fields.length + 1),
                  nestedArray: [{ field1: "field1", field2: "field2" }],
                })
              }
            >
              Add
            </button>
            <OptionFieldArray
              nestIndex={index}
              {...{ control: form.control, register: form.register }}
            />
          </li>
        );
      })}
    </>
  );
}
