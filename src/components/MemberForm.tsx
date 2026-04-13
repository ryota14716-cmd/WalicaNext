import { useEffect, useState } from "react";
import { Button, Field, inputClassName } from "./ui";
import type { Member, PreferredMethod } from "../types";

type MemberFormValues = Omit<Member, "id">;

const emptyValues: MemberFormValues = {
  name: "",
  preferredMethod: "paypay",
  paypayPhone: "",
  bankName: "",
  branchName: "",
  accountType: "",
  accountNumber: "",
  accountHolder: "",
  note: "",
};

type MemberFormProps = {
  editingMember?: Member | null;
  onSubmit: (values: MemberFormValues) => void;
  onCancel: () => void;
};

export const MemberForm = ({
  editingMember,
  onSubmit,
  onCancel,
}: MemberFormProps) => {
  const [values, setValues] = useState<MemberFormValues>(emptyValues);
  const [errors, setErrors] = useState<{ name?: string }>({});

  useEffect(() => {
    if (editingMember) {
      const { id: _id, ...rest } = editingMember;
      setValues(rest);
      setErrors({});
      return;
    }

    setValues(emptyValues);
    setErrors({});
  }, [editingMember]);

  const handleChange = (key: keyof MemberFormValues, value: string) => {
    setValues((current) => ({
      ...current,
      [key]: key === "preferredMethod" ? (value as PreferredMethod) : value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.name.trim()) {
      setErrors({ name: "名前は必須です。" });
      return;
    }

    setErrors({});
    onSubmit({
      ...values,
      name: values.name.trim(),
      paypayPhone: values.paypayPhone.trim(),
      bankName: values.bankName.trim(),
      branchName: values.branchName.trim(),
      accountType: values.accountType.trim(),
      accountNumber: values.accountNumber.trim(),
      accountHolder: values.accountHolder.trim(),
      note: values.note.trim(),
    });

    if (!editingMember) {
      setValues(emptyValues);
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="名前" required error={errors.name}>
          <input
            className={inputClassName}
            value={values.name}
            onChange={(event) => handleChange("name", event.target.value)}
            placeholder="例: 佐藤"
          />
        </Field>

        <Field label="希望送金方法">
          <select
            className={inputClassName}
            value={values.preferredMethod}
            onChange={(event) => handleChange("preferredMethod", event.target.value)}
          >
            <option value="paypay">PayPay優先</option>
            <option value="bank">銀行振込優先</option>
            <option value="other">その他 / 指定なし</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="PayPay電話番号">
          <input
            className={inputClassName}
            value={values.paypayPhone}
            onChange={(event) => handleChange("paypayPhone", event.target.value)}
            placeholder="09012345678"
          />
        </Field>

        <Field label="銀行名">
          <input
            className={inputClassName}
            value={values.bankName}
            onChange={(event) => handleChange("bankName", event.target.value)}
            placeholder="みずほ銀行"
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="支店名">
          <input
            className={inputClassName}
            value={values.branchName}
            onChange={(event) => handleChange("branchName", event.target.value)}
            placeholder="新宿支店"
          />
        </Field>
        <Field label="口座種別">
          <input
            className={inputClassName}
            value={values.accountType}
            onChange={(event) => handleChange("accountType", event.target.value)}
            placeholder="普通"
          />
        </Field>
        <Field label="口座番号">
          <input
            className={inputClassName}
            value={values.accountNumber}
            onChange={(event) => handleChange("accountNumber", event.target.value)}
            placeholder="1234567"
          />
        </Field>
        <Field label="口座名義">
          <input
            className={inputClassName}
            value={values.accountHolder}
            onChange={(event) => handleChange("accountHolder", event.target.value)}
            placeholder="サトウタロウ"
          />
        </Field>
      </div>

      <Field label="メモ">
        <textarea
          className={`${inputClassName} min-h-24 resize-y`}
          value={values.note}
          onChange={(event) => handleChange("note", event.target.value)}
          placeholder="補足があれば入力"
        />
      </Field>

      <div className="flex flex-wrap gap-3">
        <Button type="submit">{editingMember ? "更新する" : "追加する"}</Button>
        {editingMember && (
          <Button variant="secondary" onClick={onCancel}>
            編集をやめる
          </Button>
        )}
      </div>
    </form>
  );
};
