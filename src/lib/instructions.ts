import { hasBankDestination, hasPayPayDestination } from "./members";
import type { Member, PaymentInstruction, PaymentMethod, Settlement } from "../types";

const getPayPayDestination = (member: Member) => `PayPay: ${member.paypayPhone}`;

const getBankDestination = (member: Member) =>
  `${member.bankName} ${member.branchName} ${member.accountType} ${member.accountNumber} ${member.accountHolder}`;

const resolveMethod = (
  member: Member | undefined,
): Pick<PaymentInstruction, "method" | "destination" | "status"> => {
  if (!member) {
    return {
      method: "other",
      destination: "送金先未設定",
      status: "missing_destination",
    };
  }

  const canUsePayPay = hasPayPayDestination(member);
  const canUseBank = hasBankDestination(member);

  const fallback = (): Pick<PaymentInstruction, "method" | "destination" | "status"> => {
    if (canUsePayPay) {
      return {
        method: "paypay",
        destination: getPayPayDestination(member),
        status: "ready",
      };
    }

    if (canUseBank) {
      return {
        method: "bank",
        destination: getBankDestination(member),
        status: "ready",
      };
    }

    return {
      method: "other",
      destination: "送金先未設定",
      status: "missing_destination",
    };
  };

  if (member.preferredMethod === "paypay") {
    if (canUsePayPay) {
      return {
        method: "paypay",
        destination: getPayPayDestination(member),
        status: "ready",
      };
    }

    return fallback();
  }

  if (member.preferredMethod === "bank") {
    if (canUseBank) {
      return {
        method: "bank",
        destination: getBankDestination(member),
        status: "ready",
      };
    }

    return fallback();
  }

  return fallback();
};

export const generatePaymentInstructions = (
  members: Member[],
  settlements: Settlement[],
): PaymentInstruction[] => {
  const memberMap = new Map(members.map((member) => [member.id, member]));

  return settlements.map((settlement) => {
    const receiver = memberMap.get(settlement.toMemberId);
    const resolution = resolveMethod(receiver);

    return {
      id: settlement.id,
      fromMemberId: settlement.fromMemberId,
      toMemberId: settlement.toMemberId,
      amount: settlement.amount,
      currency: settlement.currency,
      method: resolution.method as PaymentMethod,
      destination: resolution.destination,
      status: resolution.status,
    };
  });
};
