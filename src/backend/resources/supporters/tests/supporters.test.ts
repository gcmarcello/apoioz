import { describe, expect, test } from "@jest/globals";
import { mockSupporter } from "../../../../tests/mockSupporter";
import { createSupporter } from "../supporters.service";
import prisma from "@/backend/prisma/prisma";

describe("sum module", () => {
  test("tests supporter creation", async () => {
    await prisma.party.createMany({
      data: [
        {
          name: "Movimento Democrático Brasileiro",
          id: "MDB",
          number: 15,
          ideology: "center",
        },
        {
          name: "Partido Trabalhista Brasileiro",
          id: "PTB",
          number: 14,
          ideology: "right",
        },
        {
          name: "Partido Democrático Trabalhista",
          id: "PDT",
          number: 12,
          ideology: "left",
        },
        {
          name: "Partido dos Trabalhadores",
          id: "PT",
          number: 13,
          ideology: "left",
        },
        {
          name: "Partido Comunista do Brasil",
          id: "PCdoB",
          number: 65,
          ideology: "left",
        },
        {
          name: "Partido Socialista Brasileiro",
          id: "PSB",
          number: 40,
          ideology: "left",
        },
        {
          name: "Partido da Social Democracia Brasileira",
          id: "PSDB",
          number: 45,
          ideology: "right",
        },
        { name: "Agir", id: "AGIR", number: 36, ideology: "center" },
        {
          name: "Partido da Mobilização Nacional",
          id: "PMN",
          number: 33,
          ideology: "center",
        },
        {
          name: "Cidadania",
          id: "CIDADANIA",
          number: 23,
          ideology: "center",
        },
        { name: "Partido Verde", id: "PV", number: 43, ideology: "center" },
        { name: "Avante", id: "AVANTE", number: 70, ideology: "center" },
        { name: "Progressistas", id: "PP", number: 11, ideology: "center" },
        {
          name: "Partido Socialista dos Trabalhadores Unificado",
          id: "PSTU",
          number: 16,
          ideology: "left",
        },
        {
          name: "Partido Comunista Brasileiro",
          id: "PCB",
          number: 21,
          ideology: "left",
        },
        {
          name: "Partido Renovador Trabalhista Brasileiro",
          id: "PRTB",
          number: 28,
          ideology: "right",
        },
        {
          name: "Democracia Cristã",
          id: "DC",
          number: 27,
          ideology: "right",
        },
        {
          name: "Partido da Causa Operária",
          id: "PCO",
          number: 29,
          ideology: "left",
        },
        { name: "Podemos", id: "PODE", number: 19, ideology: "center" },
        {
          name: "Republicanos",
          id: "REPUBLICANOS",
          number: 10,
          ideology: "center",
        },
        {
          name: "Partido Socialismo e Liberdade",
          id: "PSOL",
          number: 50,
          ideology: "left",
        },
        { name: "Partido Liberal", id: "PL", number: 22, ideology: "right" },
        {
          name: "Partido Social Democrático",
          id: "PSD",
          number: 55,
          ideology: "center",
        },
        { name: "Patriota", id: "PATRIOTA", number: 51, ideology: "right" },
        {
          name: "Solidariedade",
          id: "SOLIDARIEDADE",
          number: 77,
          ideology: "center",
        },
        { name: "Partido Novo", id: "NOVO", number: 30, ideology: "right" },
        {
          name: "Rede Sustentabilidade",
          id: "REDE",
          number: 18,
          ideology: "center",
        },
        {
          name: "Partido da Mulher Brasileira",
          id: "PMB",
          number: 35,
          ideology: "centro",
        },
        { name: "Unidade Popular", id: "UP", number: 80, ideology: "left" },
        { name: "União Brasil", id: "UNIÃO", number: 44, ideology: "right" },
      ],
    });
  });
});
