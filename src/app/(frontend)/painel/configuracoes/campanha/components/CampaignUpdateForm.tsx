"use client";
import { showToast } from "@/app/(frontend)/_shared/components/alerts/toast";
import { useAction } from "@/app/(frontend)/_shared/hooks/useAction";
import { getContrastRatioFromHex } from "@/app/(frontend)/_shared/utils/colors";
import { updateCampaign } from "@/app/api/panel/campaigns/actions";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function CampaignUpdateForm({ campaign }) {
  const form = useForm({
    defaultValues: {
      name: campaign.name,
      year: campaign.year,
      options: {
        primaryColor: campaign.options.primaryColor || "#000000",
        secondaryColor: campaign.options.secondaryColor || "#FFFFFF",
      },
    },
  });
  const [contrast, setContrast] = useState(null);

  useEffect(() => {
    setContrast(
      getContrastRatioFromHex(
        form.watch("options.primaryColor"),
        form.watch("options.secondaryColor")
      )
    );
  }, [form.watch("options.primaryColor"), form.watch("options.secondaryColor")]);

  const {
    data: supporter,
    trigger: updateCampaignTrigger,
    error,
  } = useAction({
    action: updateCampaign,
    onError: (err) => showToast({ message: err, title: "Erro", variant: "error" }),
    onSuccess: (res) =>
      showToast({
        message: `Informações atualizadas com sucesso!`,
        variant: "success",
        title: "Dados atualizados",
      }),
  });

  return (
    <main className="px-4 sm:px-6 lg:flex-auto lg:px-0">
      <div className="mt-14 max-w-2xl space-y-16 sm:space-y-20 lg:mx-4 lg:max-w-none">
        <form onSubmit={form.handleSubmit(() => updateCampaignTrigger())}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Campanha
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                As configurações disponíveis dependem de seu nível de acesso.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                <div className="grid-cols-2 space-y-4 sm:col-span-6">
                  <div className="col-span-2 lg:col-span-1">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nome da Campanha
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          autoComplete="name"
                          className="block flex-1 border-0 bg-transparent py-1.5  text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          {...form.register("name", { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Ano
                    </label>
                    <div className="mt-2">
                      <div className="flex  rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="text"
                          name="year"
                          id="year"
                          autoComplete="year"
                          className="block flex-1  border-0 bg-transparent py-1.5  text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          {...form.register("year", { required: true })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="pointer-events-none z-0 grayscale filter sm:col-span-6">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Cores - EM BREVE
                  </label>
                  <div className="mt-2 flex flex-col justify-between gap-4 space-y-4 rounded-lg  border border-gray-900/25 px-6  py-5 lg:flex-row">
                    <div className="space-y-4">
                      <div className="mb-4 flex flex-col ">
                        <div className="flex flex-col md:flex-row">
                          <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Primária
                          </label>
                          <p className="text-sm leading-6 text-gray-600 md:ms-2">
                            barra de navegação, botões principais e outros elementos.
                          </p>
                        </div>

                        <Controller
                          name="options.primaryColor"
                          control={form.control}
                          defaultValue=""
                          render={({ field }) => (
                            <div className="relative">
                              <input
                                className="absolute inset-0 h-10 w-10 cursor-pointer opacity-0"
                                type="color"
                                id="color-picker"
                                name="color"
                                {...field}
                              />
                              <div className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-gray-300 shadow-sm">
                                <div
                                  id="color-preview"
                                  className="h-full w-full rounded-full"
                                  style={{
                                    backgroundColor: form.watch("options.primaryColor"),
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex flex-col  md:flex-row">
                          <label
                            htmlFor="cover-photo"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Cor Secundária
                          </label>
                          <p className="text-sm leading-6 text-gray-600 md:ms-2 ">
                            links, botões secundários e outros elementos.
                          </p>
                        </div>

                        <Controller
                          name="options.secondaryColor"
                          control={form.control}
                          defaultValue=""
                          render={({ field }) => (
                            <div className="relative">
                              <input
                                className="absolute inset-0 h-10 w-10 cursor-pointer opacity-0"
                                type="color"
                                id="color-picker"
                                name="color"
                                {...field}
                              />
                              <div className="h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-gray-300 shadow-sm">
                                <div
                                  id="color-preview"
                                  className="h-full w-full rounded-full"
                                  style={{
                                    backgroundColor: form.watch("options.secondaryColor"),
                                  }}
                                ></div>
                              </div>
                            </div>
                          )}
                        />
                      </div>
                    </div>
                    <div className="flex items-center">
                      {contrast < 4 ? (
                        <WarningAlert
                          warnings={[
                            "Contraste entre cores insuficiente. Isso pode causar dificuldade na leitura do site.",
                          ]}
                        />
                      ) : (
                        <SuccessAlert
                          successes={[
                            "Bom contraste entre as cores. Os usuários terão uma experiência melhor ao utilizar o site.",
                          ]}
                        />
                      )}
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            {/* <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button> */}
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
