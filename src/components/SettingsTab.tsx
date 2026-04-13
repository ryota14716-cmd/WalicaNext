import { Button, Card } from "./ui";

type SettingsTabProps = {
  onResetSamples: () => void;
  onClearAll: () => void;
};

export const SettingsTab = ({ onResetSamples, onClearAll }: SettingsTabProps) => (
  <div className="grid gap-6 lg:grid-cols-2">
    <Card
      title="サンプルデータ再投入"
      description="初期表示確認用のデータを再投入します。現在の保存内容は上書きされます。"
    >
      <Button onClick={onResetSamples}>サンプルデータを再投入</Button>
    </Card>

    <Card
      title="全データ削除"
      description="保存しているメンバー情報と清算結果をすべて削除します。"
    >
      <Button variant="danger" onClick={onClearAll}>
        全データを削除
      </Button>
    </Card>
  </div>
);
