import {
  MaskedTextField,
  TextField,
} from "@/app/(frontend)/_shared/components/fields/Text";
import { CreateSupportersDto } from "@/app/api/panel/supporters/dto";
import { useForm } from "react-hook-form";

export function BasicInfoSection({
  form,
}: {
  form: ReturnType<typeof useForm<CreateSupportersDto>>;
}) {
  return (
    <>
      <div className="mt-2">
        <TextField
          hform={form}
          label="Nome do Apoiador"
          name={"name"}
          autoComplete="name"
          placeholder="ex. João Silva"
        />
      </div>
      <div className="mt-2">
        <TextField
          hform={form}
          label="Email"
          name={"email"}
          autoComplete="email"
          placeholder="ex. joao@silva.com"
        />
      </div>
      <div className="mt-2">
        <MaskedTextField
          hform={form}
          label="Celular"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="ex. 999999999"
          name="phone"
          mask="(99) 99999-9999"
        />
      </div>
      <div className="mt-2">
        <MaskedTextField
          hform={form}
          label="Data de Nascimento"
          inputMode="numeric"
          autoComplete="birthDate"
          placeholder="ex. 01/01/1990"
          name="info.birthDate"
          mask="99/99/9999"
        />
      </div>
    </>
  );
}
