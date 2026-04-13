export type PreferredMethod = "paypay" | "bank" | "other";

export type Member = {
  id: string;
  name: string;
  preferredMethod: PreferredMethod;
  paypayPhone: string;
  bankName: string;
  branchName: string;
  accountType: string;
  accountNumber: string;
  accountHolder: string;
  note: string;
};

export type Settlement = {
  id: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  currency: string;
  note: string;
};

export type InstructionStatus = "ready" | "missing_destination";

export type PaymentMethod = "paypay" | "bank" | "other";

export type PaymentInstruction = {
  id: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  destination: string;
  status: InstructionStatus;
};

export type TabKey = "members" | "settlements" | "instructions" | "settings";
