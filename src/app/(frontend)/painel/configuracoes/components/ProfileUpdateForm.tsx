"use client";
import { formatPhone } from "@/_shared/utils/format";
import { Date } from "@/app/(frontend)/_shared/components/Date";
import { updateUser } from "@/app/api/user/actions";

import InputMask from "react-input-mask";
import dayjs from "dayjs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import ElectionModalForm from "./ElectionModalForm";
import { useAction } from "@odinkit/hooks/useAction";
import { UserWithInfo } from "prisma/types/User";

export default function ProfileUpdateForm({ user }: { user: UserWithInfo }) {
  const [showFields, setShowFields] = useState({
    name: { label: "Nome", show: false },
    email: { label: "Endereço de Email", show: false },
    phone: { label: "Telefone", show: false },
    birthDate: { label: "Data de Nascimento", show: false },
  });
  const [showElectionModal, setShowElectionModal] = useState(false);

  const form = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthDate: dayjs(user.info.birthDate).add(3, "hour").format("DD/MM/YYYY"),
    },
  });

  const {
    data: supporter,
    trigger: updateUserTrigger,
    error,
  } = useAction({
    action: updateUser,
    onError: (err) => {
      showToast({ message: err, variant: "error", title: "Erro" });
    },
    onSuccess: (res) => {
      showToast({
        message: `Informações atualizadas com sucesso!`,
        variant: "success",
        title: "Dados atualizados",
      });
    },
  });

  type fieldsType = "name" | "email" | "phone" | "birthDate";
  const fields: fieldsType[] = ["name", "email", "phone", "birthDate"];

  return (
    <>
      <form>
        <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
          {fields.map((field) => (
            <div key={field}>
              <div className="pt-6 sm:flex">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                  {showFields[field].label}
                </dt>
                <dd
                  key={field}
                  className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto"
                >
                  {showFields[field].show ? (
                    field === "birthDate" ? (
                      <InputMask
                        type="text"
                        inputMode="numeric"
                        autoComplete="birthDate"
                        {...form.register("birthDate", { required: true })}
                        name="birthDate"
                        id="birthDate"
                        className="block w-3/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        mask={"99/99/9999"}
                      />
                    ) : field === "phone" ? (
                      <InputMask
                        type="text"
                        inputMode="numeric"
                        autoComplete="phone"
                        {...form.register("phone", { required: true })}
                        name="phone"
                        id="phone"
                        className="block w-3/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        mask={"(99) 99999-9999"}
                      />
                    ) : (
                      <input
                        type="text"
                        className="block w-3/4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        {...form.register(
                          field as "name" | "email" | "phone" | "birthDate",
                          {
                            required: true,
                          }
                        )}
                      />
                    )
                  ) : (
                    <div className="text-gray-900">
                      {field === "birthDate" ? (
                        <Date value={form.getValues(field)} />
                      ) : field === "phone" ? (
                        formatPhone(form.getValues(field) || "")
                      ) : (
                        form.getValues(field)
                      )}
                    </div>
                  )}
                  <div className="flex flex-col space-x-4 lg:flex-row">
                    {showFields[field].show && (
                      <button
                        type="button"
                        className="font-semibold text-gray-400 hover:text-gray-600"
                        onClick={() => {
                          setShowFields((prevShowFields) => ({
                            ...prevShowFields,
                            [field]: {
                              ...prevShowFields[field],
                              show: false,
                            },
                          }));
                        }}
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="button"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                      onClick={() => {
                        if (showFields[field].show) {
                          updateUserTrigger();
                        }
                        setShowFields((prevShowFields) => ({
                          ...prevShowFields,
                          [field]: {
                            ...prevShowFields[field],
                            show: !prevShowFields[field].show,
                          },
                        }));
                      }}
                    >
                      {showFields[field].show ? "Salvar" : "Atualizar"}
                    </button>
                  </div>
                </dd>
              </div>
            </div>
          ))}

          <div className="pt-6 text-gray-400 sm:flex">
            <dt className="font-medium  sm:w-64 sm:flex-none sm:pr-6">
              Informações Eleitorais
            </dt>
            <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
              <p className="mt-1 text-sm leading-6 ">
                Ajude seu candidato a entender melhor o seu perfil.
              </p>
              <button
                disabled
                type="button"
                className="font-semibold "
                onClick={() => setShowElectionModal(true)}
              >
                Atualizar (Em Breve)
              </button>
            </dd>
          </div>
        </dl>
      </form>
      <ElectionModalForm open={showElectionModal} setOpen={setShowElectionModal} />
    </>
  );
}
