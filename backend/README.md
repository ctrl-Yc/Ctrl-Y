backendでターミナル開く
//Ctrl-Y\backend>　

//npm入れる
npm i

↓

//prismaクライアント作成
//スキーマ変更時
doppler run -- npx prisma generate

↓

//サーバ起動
doppler run -- npm run dev
or
npm run:doppler
