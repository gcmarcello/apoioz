"use client";

import { useForm } from "react-hook-form";
import InputMask from "react-input-mask";
import { ButtonSpinner } from "../../_shared/components/Spinners";
import { createPasswordRecovery } from "@/app/api/auth/action";
import { showToast } from "../../_shared/components/alerts/toast";
import Link from "next/link";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import SuccessAlert from "../../_shared/components/alerts/successAlert";
import { useAction } from "odinkit/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PasswordResetRequestDto,
  passwordResetRequestDto,
} from "@/app/api/auth/dto";
import Image from "next/image";

export default function RecoverPasswordPage() {
  const form = useForm<PasswordResetRequestDto>({
    resolver: zodResolver(passwordResetRequestDto),
  });

  const handleMask = () => {
    const identifier = form.watch("identifier");
    if (identifier) {
      if (identifier.length === 11 && !/[a-zA-Z]/g.test(identifier)) {
        return "(99) 99999-9999";
      }
    }
    return "";
  };

  const {
    trigger: submitPasswordRecovery,
    isMutating: loading,
    data,
  } = useAction({
    action: createPasswordRecovery,
    onError: (err) =>
      showToast({ message: err.message, title: "Erro", variant: "error" }),
  });

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center bg-white px-6 py-12 lg:px-8">
      <Link href={"/login"}>
        <ArrowLeftCircleIcon className="fixed left-3 top-3 h-10 w-10  text-rose-600" />
      </Link>
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Image
          height={150}
          width={150}
          className="mx-auto"
          src="/logorose.svg"
          alt="Your Company"
        />

        <h2 className=" text-center text-2xl font-bold leading-9 tracking-tight text-gray-700">
          Recuperar ou Criar Senha
        </h2>
      </div>
      <div className="my-2 flex flex-col justify-end space-y-4 sm:mx-auto sm:w-full sm:max-w-sm">
        {data ? (
          <>
            <SuccessAlert
              successes={[
                `Um link para redefinição de senha foi enviado para o email ${data}.
        Caso o email ainda não tenha chegado, verifique sua caixa de spam.`,
              ]}
            />
            <Link href={"/login"}>
              <button
                disabled={loading}
                className="my-4 inline-flex w-full justify-center rounded-md bg-rose-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:bg-rose-300"
              >
                Voltar a tela de login
              </button>
            </Link>
          </>
        ) : (
          <>
            <p className="mb-2 text-sm text-gray-500">
              Esqueceu ou não configurou sua senha durante o cadastro? Digite
              seu email ou telefone celular para recuperar sua senha.
            </p>
            <form
              onSubmit={form.handleSubmit((data) =>
                submitPasswordRecovery(data)
              )}
              className="flex flex-col items-center"
            >
              <InputMask
                mask={handleMask()}
                maskPlaceholder={null}
                {...form.register("identifier", { required: true })}
                placeholder="Email ou telefone celular (com DDD)"
                type="text"
                className="block w-full appearance-none rounded-md border border-gray-200  px-3 py-1.5 text-gray-900 placeholder-gray-400 focus:outline-none sm:text-sm"
              />
              <button
                disabled={loading}
                className="my-4 inline-flex w-full justify-center rounded-md bg-rose-500 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 disabled:bg-rose-300"
              >
                <div className="flex items-center">
                  {loading && <ButtonSpinner />}
                  <span className="ms-2">Enviar redefinição de senha</span>
                </div>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
