import { toProperCase } from "@/(shared)/utils/format";

export function getPageName(url: string, mobile: boolean = false): string {
  const pageName = url.split("/").pop();

  if (mobile) {
    switch (pageName) {
      case "mapa":
        return "Mapa";
      case "painel":
        return "Painel";
      case "time":
        return "Time";
      case "calendario":
        return "Calendário";
      case "relatorios":
        return "Relatórios";
      case "whatsapp":
        return "WhatsApp";
      default:
        break;
    }
  } else {
    switch (pageName) {
      case "mapa":
        return "Mapa de Eleitores";
      case "painel":
        return "Painel de Controle";
      case "time":
        return "Equipe de Campanha";
      case "calendario":
        return "Calendário de Eventos";
      case "relatorios":
        return "Relatórios de Apoiador";
      case "whatsapp":
        return "WhatsApp";
      default:
        break;
    }
  }
}
