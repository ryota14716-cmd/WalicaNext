import { SettlementForm } from "./SettlementForm";
import { Button, Card } from "./ui";
import { formatCurrency } from "../lib/format";
import type { Member, Settlement } from "../types";

type SettlementsTabProps = {
  members: Member[];
  settlements: Settlement[];
  editingSettlementId: string | null;
  onEdit: (settlementId: string) => void;
  onDelete: (settlementId: string) => void;
  onSubmit: (values: Omit<Settlement, "id">) => void;
  onCancelEdit: () => void;
};

export const SettlementsTab = ({
  members,
  settlements,
  editingSettlementId,
  onEdit,
  onDelete,
  onSubmit,
  onCancelEdit,
}: SettlementsTabProps) => {
  const memberMap = new Map(members.map((member) => [member.id, member]));
  const editingSettlement =
    settlements.find((settlement) => settlement.id === editingSettlementId) ?? null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Card
        title="清算結果一覧"
        description="Walicaの結果を1件ずつ転記して登録します。"
      >
        <div className="grid gap-4">
          {settlements.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              清算結果がありません。右側のフォームから追加してください。
            </div>
          )}

          {settlements.map((settlement) => (
            <article
              key={settlement.id}
              className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-ink">
                    {memberMap.get(settlement.fromMemberId)?.name || "不明"} →{" "}
                    {memberMap.get(settlement.toMemberId)?.name || "不明"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatCurrency(settlement.amount, settlement.currency)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => onEdit(settlement.id)}>
                    編集
                  </Button>
                  <Button variant="ghost" onClick={() => onDelete(settlement.id)}>
                    削除
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                通貨: {settlement.currency} / メモ: {settlement.note || "なし"}
              </p>
            </article>
          ))}
        </div>
      </Card>

      <Card
        title={editingSettlement ? "清算結果を編集" : "清算結果を追加"}
        description={
          members.length < 2
            ? "清算結果を登録するには先に2人以上のメンバーが必要です。"
            : "金額は正の数で入力してください。"
        }
      >
        <SettlementForm
          members={members}
          editingSettlement={editingSettlement}
          onSubmit={onSubmit}
          onCancel={onCancelEdit}
        />
      </Card>
    </div>
  );
};
