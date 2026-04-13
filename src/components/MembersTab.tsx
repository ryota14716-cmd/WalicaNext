import { MemberForm } from "./MemberForm";
import { Badge, Button, Card } from "./ui";
import {
  getMemberDestinationStatus,
  hasBankDestination,
  hasPayPayDestination,
} from "../lib/members";
import type { Member } from "../types";

type MembersTabProps = {
  members: Member[];
  editingMemberId: string | null;
  onEdit: (memberId: string) => void;
  onDelete: (memberId: string) => void;
  onSubmit: (values: Omit<Member, "id">) => void;
  onCancelEdit: () => void;
};

export const MembersTab = ({
  members,
  editingMemberId,
  onEdit,
  onDelete,
  onSubmit,
  onCancelEdit,
}: MembersTabProps) => {
  const editingMember = members.find((member) => member.id === editingMemberId) ?? null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card
        title="メンバー一覧"
        description="送金先が不足しているメンバーは目立つ表示になります。"
      >
        <div className="grid gap-4">
          {members.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
              メンバーがまだありません。右側のフォームから追加してください。
            </div>
          )}

          {members.map((member) => {
            const status = getMemberDestinationStatus(member);

            return (
              <article
                key={member.id}
                className={`rounded-3xl border p-4 ${
                  status === "missing"
                    ? "border-rose-200 bg-rose-50"
                    : "border-slate-200 bg-slate-50/80"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-ink">{member.name}</h3>
                      <Badge tone={status === "missing" ? "warning" : "success"}>
                        {status === "missing" ? "送金先不足" : "送金先あり"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      優先方法:{" "}
                      {member.preferredMethod === "paypay"
                        ? "PayPay"
                        : member.preferredMethod === "bank"
                          ? "銀行振込"
                          : "その他 / 指定なし"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => onEdit(member.id)}>
                      編集
                    </Button>
                    <Button variant="ghost" onClick={() => onDelete(member.id)}>
                      削除
                    </Button>
                  </div>
                </div>

                <dl className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
                  <div>
                    <dt className="font-medium text-slate-500">PayPay</dt>
                    <dd>{hasPayPayDestination(member) ? member.paypayPhone : "未設定"}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-slate-500">銀行口座</dt>
                    <dd>
                      {hasBankDestination(member)
                        ? `${member.bankName} ${member.branchName} ${member.accountType} ${member.accountNumber} ${member.accountHolder}`
                        : "未設定"}
                    </dd>
                  </div>
                  <div className="md:col-span-2">
                    <dt className="font-medium text-slate-500">メモ</dt>
                    <dd>{member.note || "なし"}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </Card>

      <Card
        title={editingMember ? "メンバーを編集" : "メンバーを追加"}
        description="名前は必須です。同名でも内部IDで区別されます。"
      >
        <MemberForm
          editingMember={editingMember}
          onSubmit={onSubmit}
          onCancel={onCancelEdit}
        />
      </Card>
    </div>
  );
};
