import type { Member, PaymentInstruction } from "../types";

export const formatCurrency = (amount: number, currency: string) => {
  if (currency === "JPY") {
    return `${Math.round(amount).toLocaleString("ja-JP")}円`;
  }

  return `${amount.toLocaleString("ja-JP")} ${currency}`;
};

export const buildDestinationLabel = (
  instruction: PaymentInstruction,
  receiver?: Member,
) => {
  if (instruction.status === "missing_destination") {
    return "送金先未設定";
  }

  if (!receiver) {
    return instruction.destination;
  }

  if (instruction.method === "paypay") {
    return `PayPay: ${receiver.paypayPhone}`;
  }

  if (instruction.method === "bank") {
    return `振込先: ${receiver.bankName} ${receiver.branchName} ${receiver.accountType} ${receiver.accountNumber} ${receiver.accountHolder}`;
  }

  return instruction.destination;
};

export const buildInstructionMessage = (
  instruction: PaymentInstruction,
  receiver?: Member,
) => {
  const amountLabel = formatCurrency(instruction.amount, instruction.currency);
  const destinationLabel = buildDestinationLabel(instruction, receiver);
  const receiverName = receiver?.name || "受取人";

  return `${receiverName}さんへ${amountLabel}お願いします。${destinationLabel}`;
};
