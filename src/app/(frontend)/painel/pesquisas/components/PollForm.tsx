import CheckboxInput from "@/app/(frontend)/_shared/components/fields/Checkbox";
import RadioInput from "@/app/(frontend)/_shared/components/fields/Radio";
import { PageTitle } from "@/app/(frontend)/_shared/components/text/PageTitle";
import { SectionTitle } from "@/app/(frontend)/_shared/components/text/SectionTitle";
import { useForm } from "react-hook-form";

interface PollFormProps {
  data: {
    title: string;
    activeAtSignUp: boolean;
    questions: {
      name: string;
      allowMultipleAnswers: boolean;
      allowFreeAnswer: boolean;
      options: { name: string }[];
    }[];
  };
  mode: "preview" | "production";
}

export function PollForm({ data, mode }: PollFormProps) {
  const form = useForm({ defaultValues: data });
  return (
    <form>
      <div
        className="absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl lg:top-[-10rem]"
        aria-hidden="true"
      >
        <div
          className="relative left-1/2 -z-10 aspect-[1155/678] w-[36.125rem] max-w-none  rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <PageTitle>{data.title}</PageTitle>
      {data.questions.map(
        (question, index) =>
          question.name && (
            <div key={index}>
              <SectionTitle>{question.name}</SectionTitle>
              {question.options.map((option, index) => (
                <div key={index}>
                  <div className="flex items-center">
                    {question.allowMultipleAnswers ? (
                      <CheckboxInput />
                    ) : (
                      <RadioInput
                        htmlName={`question-${question.name}`}
                        name={option.name}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
      )}
    </form>
  );
}
