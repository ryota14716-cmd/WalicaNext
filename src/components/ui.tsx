import type { PropsWithChildren, ReactNode } from "react";

type CardProps = PropsWithChildren<{
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}>;

export const Card = ({
  title,
  description,
  actions,
  className = "",
  children,
}: CardProps) => (
  <section
    className={`rounded-3xl border border-white/70 bg-white/85 p-5 shadow-soft backdrop-blur ${className}`}
  >
    {(title || description || actions) && (
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          {title && <h2 className="text-lg font-semibold text-ink">{title}</h2>}
          {description && <p className="text-sm text-slate-600">{description}</p>}
        </div>
        {actions}
      </div>
    )}
    {children}
  </section>
);

type BadgeProps = {
  tone?: "neutral" | "success" | "warning";
  children: ReactNode;
};

export const Badge = ({ tone = "neutral", children }: BadgeProps) => {
  const styles = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${styles[tone]}`}>
      {children}
    </span>
  );
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
};

export const Button = ({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  const styles = {
    primary: "bg-ink text-white hover:bg-slate-800",
    secondary: "bg-clay text-ink hover:bg-[#dfceb2]",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    />
  );
};

type FieldProps = {
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export const Field = ({ label, required, error, children }: FieldProps) => (
  <label className="block">
    <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {required && <span className="text-rose-600">*</span>}
    </div>
    {children}
    {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
  </label>
);

export const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-lake focus:ring-2 focus:ring-lake/20";
