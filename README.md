# Walica送金整理ツール

Walicaで算出した清算結果を手入力し、受取人ごとの送金先情報と紐づけて「誰に・いくら・どの方法で送るか」を整理する、ブラウザ完結のWebアプリです。サーバーは使わず、データは `localStorage` に保存します。

## 起動方法

```bash
npm install
npm run dev
```

本番ビルド確認:

```bash
npm run build
```

GitHub Pages 配布:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
 git remote add origin <GitHubのリポジトリURL>
 git push -u origin main
```

## 使い方

1. メンバー管理タブでメンバーを追加、編集、削除します。
2. 清算結果タブで「誰が誰にいくら払うか」を登録します。
3. 送金一覧タブで自動生成された送金指示を確認します。
4. コピー操作で送金先や送金文面をそのまま共有できます。
5. 設定タブからサンプルデータ再投入、全データ削除ができます。

## 保存仕様

- メンバー情報: `walica-transfer-tool.members`
- 清算結果: `walica-transfer-tool.settlements`
- 初回サンプル投入フラグ: `walica-transfer-tool.bootstrapped`

初回起動時はサンプルデータが自動投入されます。以後は編集内容が `localStorage` に保持され、リロード後も復元されます。

注意:

- `localStorage` 保存のため、データは配布URLを開いた各ユーザーのブラウザごとに保存されます。
- 友達どうしで同じ入力データを自動共有する仕組みは、現時点ではありません。

## GitHub Pages で公開する方法

1. GitHub で新しいリポジトリを作成します。
2. このプロジェクトをそのリポジトリへ push します。
3. `npm run build` で `dist` を生成します。
4. `dist` の内容を `gh-pages` ブランチへ配置します。
5. GitHub のリポジトリ設定で `Settings > Pages` を開きます。
6. `Build and deployment` の `Source` を `Deploy from a branch` にします。
7. `Branch` は `gh-pages`、フォルダは `/ (root)` を選んで保存します。
8. 公開後、`https://<ユーザー名>.github.io/<リポジトリ名>/` でアクセスできます。

補足:

- このアプリは単一ページで、現在は相対パス設定にしてあるため GitHub Pages 配下でも動作します。
- 公開URLを変えると `localStorage` は別扱いになるため、以前の保存データは引き継がれません。

## 今後の拡張案

- CSV入出力
- 送金済みチェックや履歴管理
- メモの検索や並び替え
- 通貨追加や金額フォーマットの改善
- PWA化によるホーム画面追加対応
