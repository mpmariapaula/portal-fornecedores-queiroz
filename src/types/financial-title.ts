export type Filter = "all" | "overdue" | "upcoming";

export type View = "dashboard" | "list";

export type DemoState = "data" | "empty" | "error";

export type TitleItem = {
  id: string;
  description: string;
  issuedAt: Date;
  dueAt: Date;
  nominalValue: number;
  paidValue: number;
};
