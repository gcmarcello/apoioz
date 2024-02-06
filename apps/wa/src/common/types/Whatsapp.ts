import {
  ClientSession,
  BatteryInfo,
  WAState,
  GroupNotification,
  Message,
  Chat,
  Reaction,
  Call,
} from "whatsapp-web.js";

type EventsObject = {
  authenticated: ClientSession;
  authenticating: any;
  auth_failure: string;
  change_battery: BatteryInfo;
  change_state: WAState;
  disconnected: WAState | "NAVIGATION";
  group_join: GroupNotification;
  group_leave: GroupNotification;
  group_admin_changed: GroupNotification;
  group_membership_request: GroupNotification;
  group_update: GroupNotification;
  loading_screen: {
    status: number;
    message: string;
  };
  /** todo
   * contact_changed: (
    message: Message,
    oldId: string,
    newId: string,
    isContact: boolean,
  ) => void; 
  */
  media_uploaded: Message;
  message: Message;
  /** todo
   * message_ack: (message: Message, ack: MessageAck) => void;*/
  message_edit: {
    message: Message;
    newBody: string;
    prevBody: string;
  };
  unread_count: Chat;
  message_create: Message;
  /**
   * message_revoke_everyone: (
        message: Message,
        revoked_msg?: Message | null,
        ) => void;
   */
  message_revoke_me: Message;
  message_reaction: Reaction;
  chat_removed: Chat;
  /** todo
   * chat_archived: (chat: Chat, currState: boolean, prevState: boolean) => void;
    loading_screen: (percent: string, message: string) => void;
   */
  qr: string;
  call: Call;
  ready: void;
  remote_session_saved: void;
};

export type WhatsappEvents = keyof EventsObject;

export type ContextOf<T extends WhatsappEvents> = EventsObject[T];
