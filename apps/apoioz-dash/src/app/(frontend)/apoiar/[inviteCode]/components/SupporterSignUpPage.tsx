"use client";
import { useRef, useState } from "react";

import { Field, FieldValues, useForm } from "react-hook-form";

import { UserIcon } from "@heroicons/react/24/outline";
import AddSupporterSuccess from "./AddSupporterSuccess";
import {
  normalizeEmail,
  normalizePhone,
  toProperCase,
} from "@/_shared/utils/format";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { BasicInfoSection } from "./BasicInfoSection";
import { ElectionInfoSection } from "./ElectionInfoSection";
import clsx from "clsx";
import { faker, fakerPT_BR } from "@faker-js/faker";
import { useAction } from "@odinkit/hooks/useAction";
import Loading from "@/app/(frontend)/loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { BottomNavigation } from "@/app/(frontend)/_shared/components/navigation/BottomNavigation";
import { Button } from "@/app/(frontend)/_shared/components/Button";
import ErrorAlert from "@/app/(frontend)/_shared/components/alerts/errorAlert";
import { signUpAsSupporter } from "@/app/api/auth/action";
import { SignUpAsSupporterDto, signUpAsSupporterDto } from "@/app/api/auth/dto";
import { PollWithQuestionsWithOptions } from "prisma/types/Poll";
import { readSectionsByZone } from "@/app/api/elections/sections/action";
import { useMocker } from "@/app/(frontend)/_shared/components/Mocker";
import { readZonesByCampaign } from "@/app/api/elections/zones/actions";
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
  const [success, setSuccess] = useState(false);
  const [stage, setStage] = useState<string | null>("basicInfo");
  const form = useForm<SignUpAsSupporterDto>({
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
    resolver: zodResolver(signUpAsSupporterDto),
    mode: "onChange",
  });
  const errorRef = useRef(null);

  const { data: campaignZones, trigger: fetchZones } = useAction({
    action: readZonesByCampaign,
  });

  const { data: sections, trigger: fetchSections } = useAction({
    action: readSectionsByZone,
  });

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
    isMutating: isSigningUp,
    reset: resetSignUp,
  } = useAction({
    action: signUpAsSupporter,
    onSuccess: (res) => {
      setTimeout(() => {
        scrollTo({ top: 0, behavior: "smooth" });
      }, 350);
      setSuccess(true);
    },
    onError: (err) => {
      setStage("basicInfo");

      form.setError("user.email", {
        type: "400",
        message: err.toString() || "Erro inesperado",
      });
      form.setError("user.phone", {
        type: "400",
        message: err.toString() || "Erro inesperado",
      });
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

  if (isSigningUp) return <Loading />;
  if (success)
    return (
      <AddSupporterSuccess
        campaign={campaign}
        email={form.watch("user.email")}
      />
    );

  return (
    <div className=" isolate bg-white px-6 pt-8 lg:px-8">
      <div
        className="absolute inset-x-0 top-[-4rem] -z-10 transform-gpu overflow-hidden blur-3xl lg:top-[-10rem]"
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
      <div className="mx-auto max-w-2xl ">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {campaign.name}
        </h2>
        <h3 className="text-xl font-bold  tracking-tight text-zinc-700">
          {campaign.state?.name || (
            <>
              {campaign.city?.name}, {campaign.city.State?.code}
            </>
          )}
        </h3>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Preencha seus dados abaixo para fazer parte da nossa rede de apoio!
        </p>
        {user && (
          <div className="my-4 inline-flex text-gray-500 hover:text-gray-600">
            <UserIcon className="me-2 h-6 w-6" />{" "}
            <p>Convidado por {user.name}</p>
          </div>
        )}
        {/* {form.formState.errors?.root?.serverError?.message && (
          <ErrorAlert
            ref={errorRef}
            errors={[form.formState.errors?.root?.serverError?.message]}
          />
        )} */}
        <form
          className="flex h-full flex-col  divide-gray-200  text-left "
          onSubmit={form.handleSubmit((data) => signUp(data))}
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
                disabled={
                  !verifyStep([
                    "user.name",
                    "user.email",
                    "user.info.birthDate",
                    "user.phone",
                  ])
                }
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
                disabled={
                  !verifyStep([
                    "user.info.zoneId",
                    "user.info.sectionId",
                    "user.password",
                  ])
                }
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
        </form>
      </div>
    </div>
  );
}
