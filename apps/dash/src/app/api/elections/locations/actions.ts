"use server";

import * as service from "./service";
import { ActionResponse } from "odinkit";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { ReadAddressDto } from "./dto";
import { Address } from "prisma/client";

export async function readCitiesByState(data: string) {
  try {
    const cities = await service.readCitiesByState(data);
    return ActionResponse.success({
      data: cities,
    });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readStates() {
  return await service.readStates();
}

export async function readAddressFulltext(request: ReadAddressDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares({ request });

    if (!parsedRequest)
      throw "Informações não encontradas. Por favor, tente novamente.";

    const addresses = await service.readAddressFulltext(parsedRequest);

    return ActionResponse.success({ data: addresses as Address[] });
  } catch (err) {
    return ActionResponse.error(err);
  }
}

export async function readAddresses(request: ReadAddressDto) {
  try {
    const { request: parsedRequest } = await UseMiddlewares({ request });

    if (!parsedRequest)
      throw "Informações não encontradas. Por favor, tente novamente.";

    const addresses = await service.readAddresses(parsedRequest);

    return ActionResponse.success({ data: addresses });
  } catch (err) {
    console.log(err);
    return ActionResponse.error(err);
  }
}
