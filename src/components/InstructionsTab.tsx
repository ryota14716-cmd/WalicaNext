import { useMemo, useState } from "react";
import { buildInstructionMessage } from "../lib/format";
import { Badge, Button, Card, Field, inputClassName } from "./ui";
import type { Member, PaymentInstruction } from "../types";

type InstructionsTabProps = {
  members: Member[];
  instructions: PaymentInstruction[];
  onCopy: (text: string, successMessage: string) => void;
};

export const InstructionsTab = ({
  members,
  instructions,
  onCopy,
}: InstructionsTabProps) => {
  const [fromFilter, setFromFilter] = useState("all");
  const [toFilter, setToFilter] = useState("all");

  const memberMap = useMemo(
    () => new Map(members.map((member) => [member.id, member])),
    [members],
  );

  const filteredInstructions = instructions.filter((instruction) => {
    const matchFrom = fromFilter === "all" || instruction.fromMemberId === fromFilter;
    const matchTo = toFilter === "all" || instruction.toMemberId === toFilter;
    return matchFrom && matchTo;
  });

  const groupedInstructions = filteredInstructions.reduce<
    Array<{ payerId: string; items: PaymentInstruction[] }>
  >((groups, instruction) => {
    const existing = groups.find((group) => group.payerId === instruction.fromMemberId);

    if (existing) {
      existing.items.push(instruction);
      return groups;
    }

    groups.push({ payerId: instruction.fromMemberId, items: [instruction] });
    return groups;
  }, []);

  return (
    <div className="grid gap-6">
      <Card title="フィルタ" description="支払者・受取者ごとに表示を絞り込めます。">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="支払者で絞り込む">
            <select
              className={inputClassName}
              value={fromFilter}
              onChange={(event) => setFromFilter(event.target.value)}
            >
              <option value="all">すべて</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="受取者で絞り込む">
            <select
              className={inputClassName}
              value={toFilter}
              onChange={(event) => setToFilter(event.target.value)}
            >
              <option value="all">すべて</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Card>

      <Card
        title="送金一覧"
        description="受取者の希望送金方法を優先し、足りない場合は使える方法へフォールバックします。"
      >
        <div className="grid gap-5">
          {groupedInstructions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              条件に一致する送金指示がありません。
            </div>
          )}

          {groupedInstructions.map((group) => {
            const payer = memberMap.get(group.payerId);

            return (
              <section key={group.payerId} className="grid gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-ink">
                    支払者: {payer?.name || "不明"}
                  </h3>
                  <span className="text-sm text-slate-500">{group.items.length}件</span>
                </div>

                <div className="grid gap-4">
                  {group.items.map((instruction) => {
                    const receiver = memberMap.get(instruction.toMemberId);
                    const destinationLabel =
                      instruction.status === "missing_destination"
                        ? "送金先未設定"
                        : instruction.destination;
                    const message = buildInstructionMessage(instruction, receiver);

                    return (
                      <article
                        key={instruction.id}
                        className={`rounded-3xl border p-4 ${
                          instruction.status === "missing_destination"
                            ? "border-rose-200 bg-rose-50"
                            : "border-slate-200 bg-slate-50/80"
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="text-base font-semibold text-ink">
                                {payer?.name || "不明"} → {receiver?.name || "不明"}
                              </h4>
                              <Badge
                                tone={
                                  instruction.status === "missing_destination"
                                    ? "warning"
                                    : "success"
                                }
                              >
                                {instruction.status === "missing_destination"
                                  ? "送金先未設定"
                                  : "送金準備OK"}
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm text-slate-700">
                              金額: {instruction.amount.toLocaleString("ja-JP")}
                              {instruction.currency === "JPY" ? "円" : ` ${instruction.currency}`}
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                              方法:{" "}
                              {instruction.method === "paypay"
                                ? "PayPay"
                                : instruction.method === "bank"
                                  ? "銀行振込"
                                  : "その他"}
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                              送金先: {destinationLabel}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="secondary"
                              onClick={() =>
                                onCopy(destinationLabel, "送金先情報をコピーしました。")
                              }
                              disabled={instruction.status === "missing_destination"}
                            >
                              送金先をコピー
                            </Button>
                            <Button
                              onClick={() =>
                                onCopy(message, "送金文面をコピーしました。")
                              }
                            >
                              文面をコピー
                            </Button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
