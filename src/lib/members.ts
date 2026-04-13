import type { Member } from "../types";

export const hasPayPayDestination = (member: Member) =>
  member.paypayPhone.trim().length > 0;

export const hasBankDestination = (member: Member) =>
  [
    member.bankName,
    member.branchName,
    member.accountType,
    member.accountNumber,
    member.accountHolder,
  ].every((value) => value.trim().length > 0);

export const getMemberDestinationStatus = (member: Member) => {
  if (hasPayPayDestination(member) || hasBankDestination(member)) {
    return "configured";
  }

  return "missing";
};
