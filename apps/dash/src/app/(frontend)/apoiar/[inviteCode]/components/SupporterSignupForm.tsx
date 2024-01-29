"use client";
import { useRef, useState } from "react";

import AddSupporterSuccess from "./Success";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { BasicInfoSection } from "./BasicInfoSection";
import { ElectionInfoSection } from "./ElectionInfoSection";
import clsx from "clsx";
import { fakerPT_BR } from "@faker-js/faker";
import { Form, useAction, useForm } from "odinkit/client";
import Loading from "@/app/(frontend)/loading";
import { BottomNavigation } from "@/app/(frontend)/_shared/components/navigation/BottomNavigation";
import { Button } from "@/app/(frontend)/_shared/components/Button";
import { signUpAsSupporter } from "@/app/api/auth/action";
import { signUpAsSupporterDto } from "@/app/api/auth/dto";
import { PollWithQuestionsWithOptions } from "prisma/types/Poll";
import { useMocker } from "@/app/(frontend)/_shared/components/Mocker";
import { Transition } from "@headlessui/react";
import { scrollToElement } from "@/app/(frontend)/_shared/utils/scroll";

dayjs.extend(customParseFormat);

export default function SupporterSignUpPage({
  inviteCodeId,
  campaign,
  user,
  zones,
  poll,
}: {
  inviteCodeId: string;
  campaign: any;
  user: any;
  zones: any;
  poll: PollWithQuestionsWithOptions | null;
}) {
  const [stage, setStage] = useState<string | null>("basicInfo");

  const form = useForm({
    defaultValues: {
      user: {
        name: "",
        email: "",
        password: "",
        phone: "",
        info: {
          sectionId: "",
          zoneId: "",
          birthDate: "",
        },
      },
      inviteCodeId,
      poll: poll && {
        pollId: poll.id,
        questions: poll.PollQuestion.map((question) => ({
          questionId: question.id,
          answers: {
            freeAnswer: "",
          },
        })),
      },
    },
    schema: signUpAsSupporterDto,
    fieldOptions: {
      enableAsterisk: true,
    },
    mode: "onChange",
  });
  const errorRef = useRef(null);

  useMocker({
    form,
    data: async () => {
      const { data: zones } = await fetchZones(campaign?.id);
      const zone = zones![Math.floor(Math.random() * zones!.length)];
      const { data: sections } = await fetchSections(zone.id);

      return {
        "user.name": fakerPT_BR.person.fullName(),
        "user.email": fakerPT_BR.internet.email(),
        "user.phone": fakerPT_BR.phone.number(),
        "user.info.zoneId": zone.id,
        "user.info.sectionId":
          sections?.[Math.round(Math.random() * sections?.length)].id,
        "user.info.birthDate": dayjs(
          fakerPT_BR.date.past({ refDate: 1 }).toISOString()
        ).format("DD/MM/YYYY"),
      };
    },
  });

  const {
    data: signUpData,
    trigger: signUp,
    reset: resetSignUp,
  } = useAction({
    action: signUpAsSupporter,
    onSuccess: (res) => {
      setTimeout(() => {
        scrollTo({ top: 0, behavior: "smooth" });
      }, 350);
    },
    onError: (err) => {
      setStage("basicInfo");
      setTimeout(() => {
        if (errorRef.current) {
          scrollToElement(errorRef.current, 12);
        }
      }, 350);
    },
  });

  function verifyStep(fields: string[]) {
    const formFields = fields.map((field) => form.getFieldState(field as any)); //@todo

    return formFields.every((field) => !field.invalid && field.isDirty);
  }

  if (form.formState.isSubmitting) return <Loading />;

  if (form.formState.isSubmitSuccessful)
    return (
      <AddSupporterSuccess
        campaign={campaign}
        email={form.watch("user.email")}
      />
    );

  return (
    <Form
      className="flex h-full flex-col  divide-gray-200  text-left "
      hform={form}
      multistep={{
        order: ["basicInfo", "electionInfo"],
        steps: {
          basicInfo: {
            fields: [
              "user.name",
              "user.email",
              "user.info.birthDate",
              "user.phone",
            ],
            form: <BasicInfoSection />,
          },
          electionInfo: {
            fields: [
              "user.info.zoneId",
              "user.info.sectionId",
              "user.password",
            ],
            form: <ElectionInfoSection />,
          },
        },
      }}
      onSubmit={signUp}
    >
      <div className={clsx("mb-4 space-y-2 pb-2")}>
        <Transition
          show={stage === "basicInfo"}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-0 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <BasicInfoSection form={form} />
        </Transition>
        <Transition
          show={stage === "electionInfo"}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-50 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <ElectionInfoSection form={form} zones={zones} poll={poll} />
        </Transition>
      </div>
      <div className="hidden justify-between lg:flex">
        {stage === "electionInfo" && (
          <button
            type="button"
            onClick={() => {
              setStage("basicInfo");
            }}
            className={clsx(
              "rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 lg:w-auto",
              !form.formState.isValid ? "w-full" : "w-1/2"
            )}
          >
            Voltar
          </button>
        )}

        {stage === "basicInfo" ? (
          <button
            type="button"
            disabled={!verifyStep([])}
            onClick={() => {
              setStage("electionInfo");
            }}
            className={clsx(
              "inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
            )}
          >
            Próximo
          </button>
        ) : (
          <button
            disabled={!verifyStep([])}
            type="submit"
            className={clsx(
              "inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300",
              "ms-2 w-1/2"
            )}
          >
            Inscrever
          </button>
        )}
      </div>
      <BottomNavigation className="block p-2 lg:hidden">
        <div className="flex justify-between">
          {stage === "electionInfo" && (
            <Button
              variant="secondary"
              role="button"
              onClick={(e) => {
                e.preventDefault();
                setStage("basicInfo");
              }}
            >
              Voltar
            </Button>
          )}

          {stage === "basicInfo" ? (
            <Button
              onClick={(e) => {
                e.preventDefault();
                setStage("electionInfo");
              }}
              role="button"
              variant="primary"
              className="w-full"
              disabled={
                !verifyStep([
                  "user.name",
                  "user.email",
                  "user.info.birthDate",
                  "user.phone",
                ])
              }
            >
              Próximo
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={
                !verifyStep([
                  "user.info.zoneId",
                  "user.info.sectionId",
                  "user.password",
                ])
              }
              type="submit"
            >
              Inscrever
            </Button>
          )}
        </div>
      </BottomNavigation>
    </Form>
  );
}
