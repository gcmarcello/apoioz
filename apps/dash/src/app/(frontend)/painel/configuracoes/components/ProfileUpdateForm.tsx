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
import { useAction } from "odinkit/client";
import { UserWithInfo } from "prisma/types/User";
import {
  PasswordField,
  TextField,
} from "@/app/(frontend)/_shared/components/fields/Text";
import clsx from "clsx";
import { updatePassword } from "@/app/api/auth/action";
import { PasswordUpdateDto, passwordUpdateDto } from "@/app/api/auth/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileUpdateField } from "./ProfileUpdateField";

export default function ProfileUpdateForm({ user }: { user: UserWithInfo }) {
  const [showFields, setShowFields] = useState({
    name: { label: "Nome", name: "name", show: false },
    email: { label: "Endereço de Email", name: "email", show: false },
    phone: { label: "Telefone", name: "phone", show: false },
    birthDate: { label: "Data de Nascimento", name: "birthDate", show: false },
    password: { label: "Senha", name: "password", show: false },
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

  const passwordForm = useForm<PasswordUpdateDto>({
    resolver: zodResolver(passwordUpdateDto),
    mode: "onChange",
  });

  const {
    data: supporter,
    trigger: updateUserTrigger,
    error,
  } = useAction({
    action: updateUser,
    onError: (err) => {
      showToast({ message: err.message, variant: "error", title: "Erro" });
    },
    onSuccess: (res) => {
      showToast({
        message: `Informações atualizadas com sucesso!`,
        variant: "success",
        title: "Dados atualizados",
      });
    },
  });

  const {
    data: password,
    trigger: updatePasswordTrigger,
    error: passwordError,
  } = useAction({
    action: updatePassword,
    onError: (err) => {
      showToast({ message: err.message, variant: "error", title: "Erro" });
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
      <form
        className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
        onSubmit={form.handleSubmit((data) => updateUserTrigger(data))}
      >
        {fields.map((field) => (
          <ProfileUpdateField
            field={showFields[field]}
            form={form}
            setShowFields={setShowFields}
            trigger={updateUserTrigger}
            key={field}
          />
        ))}
      </form>
      <form
        className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-100 text-sm leading-6"
        onSubmit={passwordForm.handleSubmit((data) =>
          updatePasswordTrigger(data)
        )}
      >
        <ProfileUpdateField
          field={showFields.password}
          form={passwordForm}
          setShowFields={setShowFields}
          trigger={updateUserTrigger}
        />
      </form>
      <ElectionModalForm
        open={showElectionModal}
        setOpen={setShowElectionModal}
      />
    </>
  );
}
