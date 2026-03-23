# frontend — ご褒美ポケット クライアント

React + Vite で構築されたフロントエンドです。親用・子供用それぞれの画面と PWA 対応を提供します。

## 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 19.x | UI フレームワーク |
| Vite | 6.x | ビルドツール |
| Tailwind CSS | 4.x | スタイリング |
| React Router | 7.x | クライアントサイドルーティング |
| Axios | 1.x | HTTP クライアント |
| Chart.js | 4.x | 給与グラフ描画 |
| vite-plugin-pwa | 1.x | PWA 対応 |
| react-toastify | 11.x | トースト通知 |
| date-fns | 4.x | 日付操作 |

## ディレクトリ構成

```
frontend/src/
├── components/
│   ├── common/          # 汎用 UI コンポーネント（ボタン・入力欄等）
│   ├── settings/        # 設定画面コンポーネント
│   ├── tasks/           # タスク関連コンポーネント
│   │   └── child/       # 子供用タスクコンポーネント
│   └── ui/              # UI ライブラリ
├── pages/               # ページコンポーネント
├── config/              # 設定ファイル
├── lib/                 # ライブラリ・ユーティリティ
├── utils/               # 汎用ヘルパー関数
└── App.jsx              # ルーター定義
```

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env` ファイルをルートに作成し、以下の変数を設定してください。

```env
VITE_API_URL=http://localhost:3000
```

### 3. 開発サーバー起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` にアクセスしてください。

## スクリプト一覧

| スクリプト | 説明 |
|-----------|------|
| `npm run dev` | 開発サーバー起動（HMR 有効） |
| `npm run build` | 本番用ビルド |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run lint` | ESLint による静的解析 |

## ページルート一覧

| URL | ページ | 説明 |
|-----|--------|------|
| `/` | Login | 親アカウントログイン |
| `/signup` | SignupPage | 親アカウント新規登録 |
| `/top` | Top | 親用ダッシュボード（タスク一覧・給与管理） |
| `/resetRequest` | PasswordResetRequest | パスワードリセット申請 |
| `/reset` | PasswordReset | パスワードリセット |
| `/childName` | ChildSignup | 子供の追加 |
| `/childUrl` | ChildUrl | 子供用ログイン URL の表示 |
| `/child/login/:childUUID` | Keyword | 子供ログイン（あいことば認証） |
| `/child/top/:childUUID` | ChildTop | 子供用ダッシュボード（タスク一覧・給与確認） |
| `*` | NotFound | 404 ページ |
