import { birthDateValidator } from "@/_shared/utils/validators/birthDate.validator";
import { phoneValidator } from "@/_shared/utils/validators/phone.validator";
import { z } from "zod";

export const createUserDto = z.object({
  name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }).min(3),
  password: z.string().nullable().optional(),
  phone: z.custom(phoneValidator, { message: "Telefone inválido" }),
  info: z.object({
    zoneId: z.string().uuid().optional(),
    sectionId: z.string().uuid().optional(),
    birthDate: z.custom(birthDateValidator, {
      message: "Data de nascimento inválida",
    }),
  }),
});

export type CreateUserDto = z.infer<typeof createUserDto>;
