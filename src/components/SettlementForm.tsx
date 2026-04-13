import { useEffect, useState } from "react";
import { Button, Field, inputClassName } from "./ui";
import type { Member, Settlement } from "../types";

type SettlementFormValues = Omit<Settlement, "id">;

const emptyValues: SettlementFormValues = {
  fromMemberId: "",
  toMemberId: "",
  amount: 0,
  currency: "JPY",
  note: "",
};

type SettlementFormProps = {
  members: Member[];
  editingSettlement?: Settlement | null;
  onSubmit: (values: SettlementFormValues) => void;
  onCancel: () => void;
};

export const SettlementForm = ({
  members,
  editingSettlement,
  onSubmit,
  onCancel,
}: SettlementFormProps) => {
  const [values, setValues] = useState<SettlementFormValues>(emptyValues);
  const [errors, setErrors] = useState<{
    fromMemberId?: string;
    toMemberId?: string;
    amount?: string;
  }>({});

  useEffect(() => {
    if (editingSettlement) {
      const { id: _id, ...rest } = editingSettlement;
      setValues(rest);
      setErrors({});
      return;
    }

    setValues({
      ...emptyValues,
      fromMemberId: members[0]?.id ?? "",
      toMemberId: members[1]?.id ?? members[0]?.id ?? "",
    });
    setErrors({});
  }, [editingSettlement, members]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: {
      fromMemberId?: string;
      toMemberId?: string;
      amount?: string;
    } = {};

    if (!values.fromMemberId) {
      nextErrors.fromMemberId = "支払者を選択してください。";
    }

    if (!values.toMemberId) {
      nextErrors.toMemberId = "受取者を選択してください。";
    }

    if (values.amount <= 0 || Number.isNaN(values.amount)) {
      nextErrors.amount = "金額は正の数で入力してください。";
    }

    if (values.fromMemberId === values.toMemberId && values.fromMemberId) {
      nextErrors.toMemberId = "支払者と受取者は別のメンバーを選択してください。";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    onSubmit({
      ...values,
      note: values.note.trim(),
      currency: values.currency.trim() || "JPY",
    });

    if (!editingSettlement) {
      setValues({
        ...emptyValues,
        fromMemberId: members[0]?.id ?? "",
        toMemberId: members[1]?.id ?? members[0]?.id ?? "",
      });
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="支払者" required error={errors.fromMemberId}>
          <select
            className={inputClassName}
            value={values.fromMemberId}
            onChange={(event) =>
              setValues((current) => ({ ...current, fromMemberId: event.target.value }))
            }
          >
            <option value="">選択してください</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="受取者" required error={errors.toMemberId}>
          <select
            className={inputClassName}
            value={values.toMemberId}
            onChange={(event) =>
              setValues((current) => ({ ...current, toMemberId: event.target.value }))
            }
          >
            <option value="">選択してください</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Field label="金額" required error={errors.amount}>
          <input
            className={inputClassName}
            type="number"
            min="1"
            step="1"
            value={values.amount || ""}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                amount: Number(event.target.value),
              }))
            }
            placeholder="3200"
          />
        </Field>

        <Field label="通貨">
          <input
            className={inputClassName}
            value={values.currency}
            onChange={(event) =>
              setValues((current) => ({ ...current, currency: event.target.value }))
            }
            placeholder="JPY"
          />
        </Field>

        <Field label="メモ">
          <input
            className={inputClassName}
            value={values.note}
            onChange={(event) =>
              setValues((current) => ({ ...current, note: event.target.value }))
            }
            placeholder="例: 飲み会"
          />
        </Field>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={members.length < 2}>
          {editingSettlement ? "更新する" : "追加する"}
        </Button>
        {editingSettlement && (
          <Button variant="secondary" onClick={onCancel}>
            編集をやめる
          </Button>
        )}
      </div>
    </form>
  );
};
