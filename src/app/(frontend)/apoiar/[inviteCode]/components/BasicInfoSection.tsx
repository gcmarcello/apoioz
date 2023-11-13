import dayjs from "dayjs";
import InputMask from "react-input-mask";

export function BasicInfoSection({ form }: { form: any }) {
  return (
    <>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Nome do Apoiador
        </label>
        <div className="mt-2">
          <input
            type="text"
            autoComplete="name"
            placeholder="ex. João Silva"
            {...form.register("name", { required: true })}
            id="name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Email
        </label>
        <div className="mt-2">
          <input
            type="text"
            autoComplete="email"
            placeholder="ex. joao@silva.com"
            {...form.register("email", { required: true })}
            id="email"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Celular
        </label>
        <div className="mt-2">
          <InputMask
            type="text"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="ex. 999999999"
            {...form.register("phone", {
              required: true,
            })}
            name="phone"
            id="phone"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            mask="(99) 99999-9999"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="birthDate"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Data de Nascimento
        </label>
        <InputMask
          type="text"
          inputMode="numeric"
          autoComplete="date"
          {...form.register("info.birthDate", {
            required: true,
            validate: (value) =>
              dayjs(value, "DD/MM/YYYY").isBefore(dayjs().subtract(16, "year")),
          })}
          name="info.birthDate"
          id="birthDate"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          mask="99/99/9999"
        />
      </div>
    </>
  );
}
