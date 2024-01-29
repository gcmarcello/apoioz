"use client";
import { useRef, useState } from "react";

import AddSupporterSuccess from "./Success";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { BasicInfoSection } from "./BasicInfoSection";
import { ElectionInfoSection } from "./ElectionInfoSection";
import clsx from "clsx";
import { fakerPT_BR } from "@faker-js/faker";
import { Button, MultistepForm, useAction, useForm } from "odinkit/client";
import Loading from "@/app/(frontend)/loading";
import { BottomNavigation } from "@/app/(frontend)/_shared/components/navigation/BottomNavigation";
import { signUpAsSupporter } from "@/app/api/auth/action";
import { signUpAsSupporterDto } from "@/app/api/auth/dto";
import { PollWithQuestionsWithOptions } from "prisma/types/Poll";
import { useMocker } from "@/app/(frontend)/_shared/components/Mocker";
import { Transition } from "@headlessui/react";
import { scrollToElement } from "@/app/(frontend)/_shared/utils/scroll";
import { readSectionsByZone } from "@/app/api/elections/sections/action";
import { For } from "odinkit";

dayjs.extend(customParseFormat);

export default function SupporterSignUpForm({
  inviteCodeId,
  campaign,
  zones,
  poll,
}: {
  inviteCodeId: string;
  campaign: any;
  zones: any;
  poll: PollWithQuestionsWithOptions | null;
}) {
  const errorRef = useRef(null);

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

  const {
    data: sections,
    trigger: fetchSections,
    reset: resetSections,
  } = useAction({
    action: readSectionsByZone,
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
      setTimeout(() => {
        if (errorRef.current) {
          scrollToElement(errorRef.current, 12);
        }
      }, 350);
    },
  });

  useMocker({
    form,
    data: async () => {
      const zone = zones![Math.floor(Math.random() * zones!.length)];
      const { data: sections } = await fetchSections(zone.id);

      return {
        "user.name": fakerPT_BR.person.fullName(),
        "user.email": fakerPT_BR.internet.email(),
        "user.phone": fakerPT_BR.phone.number(),
        "user.info.zoneId": zone.id,
        "user.info.sectionId":
          sections?.[Math.round(Math.random() * sections?.length)]?.id,
        "user.info.birthDate": dayjs(
          fakerPT_BR.date.past({ refDate: 1 }).toISOString()
        ).format("DD/MM/YYYY"),
      };
    },
  });

  if (form.formState.isSubmitting) return <Loading />;

  if (form.formState.isSubmitSuccessful)
    return (
      <AddSupporterSuccess
        campaign={campaign}
        email={form.watch("user.email")}
      />
    );

  return (
    <MultistepForm
      className="flex h-full flex-col  divide-gray-200  text-left "
      hform={form}
      onSubmit={signUp}
      order={["basicInfo", "electionInfo"]}
      steps={{
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
          fields: ["user.info.zoneId", "user.info.sectionId", "user.password"],
          form: <ElectionInfoSection zones={zones} poll={poll} />,
        },
      }}
    >
      {({
        currentStepIndex,
        currentStepKey,
        prevStep,
        nextStep,
        stepCount,
        stepOrder,
        steps,
        isCurrentStepValid,
        walk,
      }) => (
        <>
          <div className={clsx("mb-4 space-y-2 pb-2")}>
            <For each={stepOrder}>
              {(step) => (
                <Transition
                  show={step === currentStepKey}
                  enter="ease-out duration-200"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-0 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  {steps[currentStepKey].form}
                </Transition>
              )}
            </For>
          </div>
          <div className="hidden justify-between lg:flex">
            {currentStepIndex > 0 && prevStep >= 0 && (
              <Button
                type="button"
                plain={true}
                onClick={() => {
                  walk(-1);
                }}
              >
                Voltar
              </Button>
            )}

            {currentStepIndex != stepCount - 1 &&
              nextStep === stepCount - 1 && (
                <Button
                  type="button"
                  color="indigo"
                  className="w-full"
                  onClick={() => {
                    walk(1);
                  }}
                  disabled={!isCurrentStepValid}
                >
                  Próximo
                </Button>
              )}

            {currentStepIndex === stepCount - 1 && (
              <Button
                type="submit"
                color="indigo"
                disabled={!isCurrentStepValid}
              >
                Inscrever
              </Button>
            )}
          </div>
          <BottomNavigation className="block p-2 lg:hidden">
            <div className="flex justify-between">
              {prevStep > 0 && (
                <Button
                  type="button"
                  onClick={() => {
                    walk(-1);
                  }}
                >
                  Voltar
                </Button>
              )}

              {currentStepIndex != stepCount - 1 &&
                nextStep === stepCount - 1 && (
                  <Button
                    type="button"
                    onClick={() => {
                      walk(1);
                    }}
                    disabled={!isCurrentStepValid}
                  >
                    Próximo
                  </Button>
                )}

              {currentStepIndex === stepCount - 1 && (
                <Button type="submit" disabled={!isCurrentStepValid}>
                  Inscrever
                </Button>
              )}
            </div>
          </BottomNavigation>
        </>
      )}
    </MultistepForm>
  );
}
