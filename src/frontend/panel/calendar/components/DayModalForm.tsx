"use client";
import { useForm } from "react-hook-form";
import { Button } from "../../(shared)/components/button";
import InputMask from "react-input-mask";

export default function SubmitEventRequest() {
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    control,
    setValue,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      date: "",
      location: "",
    },
  });

  return (
    <div className="my-2">
      <div className="mt-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Nome do Evento
        </label>
        <div className="mt-1">
          <input
            type="text"
            autoComplete="title"
            {...register("name", { required: true })}
            id="name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Descrição do Evento
        </label>
        <div className="mt-1">
          <textarea
            autoComplete="description"
            {...register("description", { required: true })}
            id="description"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="mt-4">
        <label
          htmlFor="date"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Data
        </label>
        <div className="mt-1">
          <InputMask
            type="text"
            inputMode="numeric"
            autoComplete="date"
            {...register("date", { required: true })}
            id="date"
            name="date"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            mask="99/99/9999"
          />
        </div>
      </div>
      <div className="mt-4">
        <label
          htmlFor="location"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Local do Evento
        </label>
        <div className="mt-1">
          <input
            type="text"
            autoComplete="location"
            {...register("location", { required: true })}
            id="location"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="mt-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Descrição do Evento
        </label>
        <div className="mt-1">
          <textarea
            autoComplete="description"
            {...register("description", { required: true })}
            id="description"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="mt-5 flex justify-end space-x-2 sm:mt-6">
        <Button variant="secondary" onClick={() => {}}>
          Voltar
        </Button>
        <Button variant="primary" onClick={() => {}}>
          Marcar Evento
        </Button>
      </div>
    </div>
  );
}
