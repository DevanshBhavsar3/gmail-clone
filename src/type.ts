export type MailType = {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  createdAt: number;
  type?: string;
  threadId: string;
};

export type MessageType = {
  message: string;
  messageAt: number;
  sender: string;
};

export type ThreadType = {
  messageCount: number;
  messages: MessageType[];
};

export type MailContextType = {
  emails: MailType[];
  setEmails: (emails: MailType[]) => void;
  selectAllEmails: boolean;
  setSelectAllEmails: (selectAllEmails: boolean) => void;
  selectedEmails: MailType[];
  setSelectedEmails: (
    selectedEmails: MailType[] | ((prev: MailType[]) => MailType[])
  ) => void;
  reload: number;
  setReload: (randomNumber: number) => void;
  searchValue: string;
};
