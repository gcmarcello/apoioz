import CheckboxInput from "@/app/(frontend)/_shared/components/fields/Checkbox";
import RadioInput from "@/app/(frontend)/_shared/components/fields/Radio";
import { TextAreaField } from "@/app/(frontend)/_shared/components/fields/Text";
import { useFieldArray } from "react-hook-form";

export function PollQuestions({ poll, form }: { poll: any; form: any }) {
  const { fields } = useFieldArray({
    control: form.control,
    name: "poll.questions",
  });

  return (
    <div className="my-4">
      {poll.PollQuestion.map(
        (question, index) =>
          question.question && (
            <div
              key={question.id}
              className="my-4 overflow-hidden rounded-lg shadow ring-1 ring-black ring-opacity-5"
            >
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      <div className="font-semibold">{question.question}</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {question.PollOption.map((option, optionIndex) => (
                    <tr key={option.id}>
                      <td className="flex items-center whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {question.allowMultipleAnswers ? (
                          <CheckboxInput
                            hform={form}
                            label={option.name}
                            name={`poll.questions.${index}.answers.options.${option.id}`}
                          />
                        ) : (
                          <RadioInput
                            hform={form}
                            label={option.name}
                            group={`poll.questions.${index}.answers.options`}
                            data={option.id}
                            name={`poll.questions.${index}.answers.options.${option.id}`}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                  {question.allowFreeAnswer && (
                    <tr>
                      <td className="p-4">
                        <TextAreaField
                          hform={form}
                          label={
                            question.PollOption.length ? "Comentários:" : "Resposta:"
                          }
                          name={`poll.questions.${index}.answers.freeAnswer`}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )
      )}
    </div>
  );
}
