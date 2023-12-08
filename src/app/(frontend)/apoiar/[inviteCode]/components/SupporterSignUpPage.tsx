"use client";
import { useRef, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import axios from "axios";
import { EyeIcon, EyeSlashIcon, UserIcon } from "@heroicons/react/24/outline";
import AddSupporterSuccess from "./AddSupporterSuccess";
import { normalizeEmail, normalizePhone, toProperCase } from "@/_shared/utils/format";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { BasicInfoSection } from "./BasicInfoSection";
import { ElectionInfoSection } from "./ElectionInfoSection";
import clsx from "clsx";
import { Mocker } from "@/app/(frontend)/_shared/components/Mocker";
import { createSupporter, signUpAsSupporter } from "@/app/api/panel/supporters/actions";
import { faker } from "@faker-js/faker";
import prisma from "prisma/prisma";
import { useAction } from "@/app/(frontend)/_shared/hooks/useAction";
import Loading from "@/app/(frontend)/loading";

dayjs.extend(customParseFormat);

export default function SupporterSignUpPage({
  referral,
  campaign,
  user,
  zones,
  poll,
}: {
  referral: any;
  campaign: any;
  user: any;
  zones: any;
  poll: any;
}) {
  const [success, setSuccess] = useState(false);
  const [stage, setStage] = useState("basicInfo");
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      info: {
        sectionId: "",
        zoneId: "",
        birthDate: "",
      },
      campaign: {
        referralId: referral.id,
        campaignId: campaign.id,
      },
      questions: poll?.questions?.map((question) => ({
        questionId: question.id,
        answer: { options: [], freeAnswer: "" },
      })),
    },
  });

  const mockData = async () => {
    if (!zones) return;
    const phone = faker.phone.number();
    const data = {
      name: faker.person.fullName(),
      email: normalizeEmail(faker.internet.email()),
      phone: normalizePhone(phone),
      zoneId: "5a9734d8-0068-41de-ac51-ccb81f22b821",
      sectionId: "827a0c56-1a47-442e-bd9c-222d8a8b33a2",
      birthDate: dayjs(faker.date.birthdate()).format("DD/MM/YYYY"),
      campaign: {
        referralId: referral.id,
        campaignId: campaign.id,
      },
    };
    form.setValue("name", data.name);
    form.setValue("email", data.email);
    form.setValue("phone", data.phone);
    form.setValue("info.zoneId", data.zoneId);
    form.setValue("info.sectionId", data.sectionId);
    form.setValue("info.birthDate", data.birthDate);

    return data;
  };

  const transformQuestionObjectIntoArray = (questions) => {
    const arr = Object.keys(questions).map((questionId) => {
      return {
        questionId: questionId,
        answers: questions[questionId].answers,
      };
    });
    return arr;
  };

  const {
    data: signUpData,
    trigger: signUp,
    isMutating: isSigningUp,
    reset: resetSignUp,
  } = useAction({
    formatter: (data) => {
      data.phone = normalizePhone(data.phone);
      data.questions = transformQuestionObjectIntoArray(data.questions);
      return data;
    },
    action: signUpAsSupporter,
    onSuccess: (res) => {
      setTimeout(() => {
        scrollTo({ top: 0, behavior: "smooth" });
      }, 350);
      setSuccess(true);
    },
    onError: (err) => {
      form.setError("root.serverError", {
        type: "400",
        message: err.toString() || "Erro inesperado",
      });
    },
  });

  if (isSigningUp) return <Loading />;
  if (success) return <AddSupporterSuccess campaign={campaign} />;

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
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Preencha seus dados abaixo para fazer parte da nossa rede de apoio!
        </p>
        {user && (
          <div className="my-4 inline-flex text-gray-500 hover:text-gray-600">
            <UserIcon className="me-2 h-6 w-6" /> <p>Convidado por {user.name}</p>
          </div>
        )}
        <form
          className="flex h-full flex-col  divide-gray-200  text-left"
          onSubmit={form.handleSubmit((data) => signUp(data))}
        >
          <div className={clsx("mb-4 space-y-2 pb-2")}>
            {stage === "basicInfo" && <BasicInfoSection form={form} />}

            {stage === "electionInfo" && (
              <ElectionInfoSection form={form} zones={zones} poll={poll} />
            )}
          </div>
          <div className="flex justify-between">
            {stage === "electionInfo" && (
              <button
                role="button"
                onClick={() => setStage("basicInfo")}
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
                onClick={(e) => {
                  e.preventDefault();
                  setStage("electionInfo");
                }}
                className={clsx(
                  "inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300"
                )}
              >
                Inscrever
              </button>
            ) : (
              <button
                disabled={!form.formState.isValid}
                type="submit"
                className={clsx(
                  "inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300",
                  stage === "basicInfo" ? "w-full" : "ms-2 w-1/2"
                )}
              >
                Inscrever
              </button>
            )}
          </div>
        </form>
      </div>
      <Mocker mockData={mockData} submit={form.handleSubmit((data) => signUp(data))} />
    </div>
  );
}
