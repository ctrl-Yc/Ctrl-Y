backendでターミナル開く
//Ctrl-Y\backend>　

//npm入れる
npm i

↓

//prismaクライアント作成
npx prisma generate

↓

//dopplerからconst anonKey,const urlを取ってきてサーバ起動
doppler run -- npm run dev
