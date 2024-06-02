"use client";
import { useRef, useState } from "react";

import AddSupporterSuccess from "./Success";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { BasicInfoSection } from "./BasicInfoSection";
import { ElectionInfoSection } from "./ElectionInfoSection";
import clsx from "clsx";
import { fakerPT_BR } from "@faker-js/faker";
import {
  Button,
  MultistepForm,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import Loading from "@/app/(frontend)/loading";
import { BottomNavigation } from "@/app/(frontend)/_shared/components/navigation/BottomNavigation";
import { signUpAsSupporter } from "@/app/api/auth/action";
import { signUpAsSupporterDto } from "@/app/api/auth/dto";
import { PollWithQuestionsWithOptions } from "prisma/types/Poll";
import { useMocker } from "@/app/(frontend)/_shared/components/Mocker";
import { Transition } from "@headlessui/react";
import { scrollToElement } from "@/app/(frontend)/_shared/utils/scroll";
import { readSectionsByZone } from "@/app/api/elections/sections/action";
import { ButtonSpinner, For } from "odinkit";
import { UserWithoutPassword } from "prisma/types/User";
import { UserIcon } from "@heroicons/react/24/solid";

dayjs.extend(customParseFormat);

export default function SupporterSignUpForm({
  inviteCodeId,
  campaign,
  zones,
  poll,
  user,
}: {
  inviteCodeId: string;
  campaign: any;
  zones: any;
  user: UserWithoutPassword;
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
    isMutating: isSigningUp,
  } = useAction({
    action: signUpAsSupporter,
    onSuccess: (res) => {
      setTimeout(() => {
        scrollTo({ top: 0, behavior: "smooth" });
      }, 350);
    },
    onError: (err) => {
      showToast({
        message: err,
        title: "Erro",
        variant: "error",
      });
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

  if (signUpData)
    return (
      <AddSupporterSuccess
        campaign={campaign}
        email={form.watch("user.email")}
      />
    );

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {campaign.name}
      </h2>
      <h3 className="text-xl font-bold  tracking-tight text-zinc-700">
        {campaign.state?.name || (
          <>
            {campaign.city?.name}, {campaign.city?.State?.code}
          </>
        )}
      </h3>
      <p className="mt-2 text-lg leading-8 text-gray-600">
        Preencha seus dados abaixo para fazer parte da nossa rede de apoio!
      </p>
      {user && (
        <div className="my-4 inline-flex text-gray-500 hover:text-gray-600">
          <UserIcon className="me-2 h-6 w-6" /> <p>Convidado por {user.name}</p>
        </div>
      )}

      <MultistepForm
        className="flex h-full flex-col divide-gray-200  text-left  "
        hform={form}
        onSubmit={signUp}
        order={["basicInfo", "electionInfo"]}
        steps={{
          basicInfo: {
            fields: ["user.name", "user.info.birthDate", "user.phone"],
            form: <BasicInfoSection />,
          },
          electionInfo: {
            fields: ["user.password"],
            refine: (data: any) => {
              return Boolean(
                data.user.info.addressId ||
                  (data.user.info.sectionId && data.user.info.zoneId)
              );
            },
            form: (
              <ElectionInfoSection
                campaign={campaign}
                zones={zones}
                poll={poll}
              />
            ),
          },
        }}
      >
        {({
          currentStep,
          hasNextStep,
          hasPrevStep,
          order,
          steps,
          isCurrentStepValid,
          walk,
        }) => (
          <>
            <div className={clsx("mb-4 space-y-2 pb-2 lg:mb-2")}>
              <For each={order}>
                {(step) => (
                  <Transition
                    show={step === order[currentStep]}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-0 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    {steps[step].form}
                  </Transition>
                )}
              </For>
            </div>

            <div className="hidden justify-between lg:flex">
              {hasPrevStep && (
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

              {hasNextStep && (
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

              {!hasNextStep && hasPrevStep && (
                <Button
                  type="submit"
                  color="indigo"
                  disabled={!isCurrentStepValid}
                >
                  <div className="flex items-center gap-2">
                    Inscrever
                    {isSigningUp && <ButtonSpinner />}
                  </div>
                </Button>
              )}
            </div>
            <BottomNavigation className="block p-2 lg:hidden">
              <div className="flex justify-between">
                {hasPrevStep && (
                  <Button
                    type="button"
                    onClick={() => {
                      walk(-1);
                    }}
                  >
                    Voltar
                  </Button>
                )}

                {hasNextStep && (
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

                {!hasNextStep && (
                  <Button
                    type="submit"
                    color="indigo"
                    disabled={
                      isSigningUp ||
                      !isCurrentStepValid ||
                      !(
                        form.watch("user.info.addressId") ||
                        (form.watch("user.info.sectionId") &&
                          form.watch("user.info.zoneId"))
                      )
                    }
                  >
                    <div className="flex items-center gap-2">
                      Inscrever
                      {isSigningUp && <ButtonSpinner />}
                    </div>
                  </Button>
                )}
              </div>
            </BottomNavigation>
          </>
        )}
      </MultistepForm>
    </>
  );
}
