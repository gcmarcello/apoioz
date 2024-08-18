import { SupporterSession } from "@/middleware/functions/supporterSession.middleware";
import { Dispatch, SetStateAction } from "react";

export const wsURL: string =
  (process.env.NODE_ENV === "development" ? "ws" : "wss") +
  "://" +
  process.env.NEXT_PUBLIC_WS_SERVER;

export function mapWebSocketHandling(
  key: string,
  supporterSession: SupporterSession,
  setWsConnected: Dispatch<SetStateAction<boolean>>,
  trigger: () => void
) {
  const socket = new WebSocket(key);
  socket.addEventListener("open", () => {
    setWsConnected(true);
    socket.send(`campaign:${supporterSession.campaignId}`);
  });
  socket.addEventListener("close", () => {
    setWsConnected(false);
  });
  socket.addEventListener("error", () => setWsConnected(false));

  socket.addEventListener("message", () => {
    trigger();
  });

  return () => socket.close();
}
