import { useFieldArray } from "react-hook-form";
import CheckboxInput from "../../_shared/components/fields/Checkbox";
import { PollQuestion } from "@prisma/client";

export default function ExternalPollSubFieldArray({
  nestIndex,
  hform,
  question,
}: {
  nestIndex: number;
  hform: any;
  question: PollQuestion;
}) {
  const { fields } = useFieldArray({
    control: hform.control, // control props comes from useForm (optional: if you are using FormContext)
    name: `questions.${nestIndex}.answers`, // unique name for your Field Array
  });

  return fields.map((item, k) => (
    <tr key={`option-${k}`}>
      <td className="flex items-center whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
        {question?.allowMultipleAnswers ? (
          <CheckboxInput
            hform={hform}
            label={option.name}
            name={`answers.${question.id}.answer.options.${option.optionId}`}
          />
        ) : (
          <RadioInput
            hform={form}
            label={option.name}
            group={`answers.${question.id}.answer.options`}
            data={option.id}
            name={`answers.${question.id}.answer.options.${option.optionId}`}
          />
        )}
      </td>
    </tr>
  ));
}
