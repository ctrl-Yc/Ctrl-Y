# backend — ご褒美ポケット API サーバー

Express + Node.js で構築された REST API サーバーです。親子タスク管理・給与集計・認証・通知機能を提供します。

## 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| Express | 5.x | Web フレームワーク |
| Node.js | v18+ | ランタイム |
| Prisma | 6.x | ORM |
| PostgreSQL | — | データベース（Supabase） |
| JWT | 9.x | 認証トークン |
| bcrypt | 6.x | パスワードハッシュ |
| nodemailer | 7.x | メール送信（Gmail） |
| node-cron | 4.x | 月次給与集計ジョブ |
| web-push | 3.x | プッシュ通知 |

## ディレクトリ構成

```
backend/
├── prisma/
│   └── schema.prisma        # データモデル定義
├── src/
│   ├── controllers/         # HTTPリクエスト/レスポンス処理
│   │   └── tasks/           # タスク操作（get/post/patch/del/stats）
│   ├── routes/              # APIルート定義
│   ├── services/            # ビジネスロジック層
│   │   └── tasks/
│   ├── middlewares/         # 認証・認可ミドルウェア
│   │   ├── auth.js          # JWT 検証
│   │   └── parentOnly.js    # 親アカウント専用制限
│   ├── lib/                 # 共通ライブラリ
│   │   ├── prisma.js        # Prisma クライアント（@db エイリアス）
│   │   ├── jwt.js           # JWT 操作
│   │   ├── mail.js          # メール送信
│   │   ├── cors.js          # CORS 設定
│   │   └── cron.js          # 月次集計ジョブ
│   ├── utils/               # 汎用ヘルパー
│   │   ├── AppError.js      # カスタムエラークラス
│   │   ├── responseHandler.js
│   │   ├── parseUtils.js
│   │   └── taskAuthUtils.js # タスク認可ヘルパー
│   └── index.js             # Express アプリ設定
├── server.js                # エントリーポイント
├── swagger.json             # OpenAPI 仕様
└── nodemon.json
```

## セットアップ

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env` ファイルをルートに作成し、以下の変数を設定してください。

```env
# データベース
DATABASE_URL=postgresql://user:password@host:5432/dbname
SB_URL=https://xxx.supabase.co
SB_CONNECT=postgresql://...     # Supabase 直接接続 URL

# 認証
JWT_SECRET=your-secret-key

# サーバー
PORT=3000
API_BASE_URL=http://localhost

# メール送信（Gmail）
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password

# プッシュ通知（VAPID）
VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:your-email@gmail.com
```

> **Doppler を使う場合**: `.env` の代わりに Doppler CLI で環境変数を管理できます。

### 3. Prisma クライアント生成

```bash
npx prisma generate
```

スキーマを変更した場合も再実行してください。

### 4. マイグレーション（初回・スキーマ変更時）

```bash
npx prisma migrate dev
```

### 5. 開発サーバー起動

```bash
npm run dev
```

Doppler を使う場合:

```bash
npm run dev:doppler
```

## スクリプト一覧

| スクリプト | 説明 |
|-----------|------|
| `npm run dev` | 開発サーバー起動（nodemon によるホットリロード） |
| `npm run dev:doppler` | Doppler 経由で開発サーバー起動 |
| `npm start` | 本番サーバー起動 |
| `npm run migrate:deploy` | 本番マイグレーション実行 |
| `npm run swagger` | swagger.json 自動生成 |

## API ルート一覧

| メソッド | パス | 説明 | 認証 |
|---------|------|------|------|
| POST | `/api/parents/register` | 親アカウント登録 | — |
| POST | `/api/parents/login` | 親ログイン | — |
| PATCH | `/api/parents/password` | パスワード変更 | 親 |
| GET | `/api/children` | 子供一覧取得 | 親 |
| POST | `/api/children` | 子供追加 | 親 |
| POST | `/api/children/login` | 子供ログイン（あいことば認証） | — |
| GET | `/api/tasks` | タスク一覧取得 | 親/子 |
| POST | `/api/tasks` | タスク作成 | 親 |
| PATCH | `/api/tasks/:id` | タスク編集 | 親 |
| PATCH | `/api/tasks/:id/:label` | タスクステータス変更 | 親/子 |
| DELETE | `/api/tasks/:id` | タスク削除 | 親 |
| GET | `/api/pay` | 給与一覧取得 | 親 |
| GET/PATCH | `/api/setting` | 設定取得・更新 | 親 |
| POST | `/api/setup` | 初期設定 | 親 |
| GET/POST | `/notification` | プッシュ通知登録・送信 | 親/子 |
| GET | `/email/change` | メールアドレス変更 | — |

## API ドキュメント

開発サーバー起動後、以下の URL で Swagger UI を確認できます。

```
http://localhost:3000/api-docs
```
