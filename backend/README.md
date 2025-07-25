backend でターミナル開く
//Ctrl-Y\backend>

//npm 入れる
npm i

↓

//prisma クライアント作成
//スキーマ変更時
doppler run -- npx prisma generate

↓

//サーバ起動
doppler run -- npm run dev
or
npm run dev:doppler
