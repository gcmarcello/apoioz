import { birthDateValidator } from "@/_shared/utils/validators/birthDate.validator";
import { phoneValidator } from "@/_shared/utils/validators/phone.validator";
import { z } from "zod";

export const createUserDto = z.object({
  name: z.string().min(3, { message: "Nome deve ter no mínimo 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }).min(3).optional(),
  password: z.string().nullable().optional(),
  phone: z.custom(phoneValidator as any, { message: "Telefone inválido" }),
  info: z
    .object({
      addressId: z.string().uuid({ message: "Endereço inválido" }).optional(),
      zoneId: z
        .string()
        .uuid({
          message: "Zona inválida",
        })
        .optional(),
      sectionId: z
        .string()
        .uuid({
          message: "Seção inválida",
        })
        .optional(),
      birthDate: z.custom(birthDateValidator as any, {
        message: "Data de nascimento inválida",
      }),
    })
    .refine((v) => v.addressId || (v.zoneId && v.sectionId), {
      message: "Endereço ou zona e seção são obrigatórios",
    }),
});

//@todo Temporary any until Zod accepts our pull request

export type CreateUserDto = z.infer<typeof createUserDto>;
