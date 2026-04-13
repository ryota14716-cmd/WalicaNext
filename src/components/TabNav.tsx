import type { TabKey } from "../types";

const tabs: { key: TabKey; label: string }[] = [
  { key: "members", label: "メンバー管理" },
  { key: "settlements", label: "清算結果入力" },
  { key: "instructions", label: "送金一覧" },
  { key: "settings", label: "設定" },
];

type TabNavProps = {
  currentTab: TabKey;
  onChange: (tab: TabKey) => void;
};

export const TabNav = ({ currentTab, onChange }: TabNavProps) => (
  <nav className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
    {tabs.map((tab) => {
      const active = currentTab === tab.key;

      return (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
            active
              ? "border-ink bg-ink text-white shadow-soft"
              : "border-white/70 bg-white/70 text-slate-700 hover:bg-white"
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </nav>
);
