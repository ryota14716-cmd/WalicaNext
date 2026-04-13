import type { TabKey } from "../types";

const tabLabels: Record<TabKey, string> = {
  members: "メンバー管理",
  settlements: "清算結果入力",
  instructions: "送金一覧",
  settings: "設定",
};

type HeaderProps = {
  currentTab: TabKey;
};

export const Header = ({ currentTab }: HeaderProps) => (
  <header className="rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-soft backdrop-blur">
    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ember">
      Walica Transfer Organizer
    </p>
    <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold text-ink md:text-4xl">
          Walica送金整理ツール
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Walicaの清算結果を入力して、送金先とコピー文面までまとめて整理できます。
        </p>
      </div>
      <div className="rounded-2xl bg-clay px-4 py-3 text-sm font-medium text-ink">
        現在: {tabLabels[currentTab]}
      </div>
    </div>
  </header>
);
