//sw.js
const BASE_URL ='';//デプロイ後のURL

/**
 * Service Workerのインストールイベント
 */
self.addEventListener('install', () => {
    console.log('Service Worker: インストールされました');
    // Service Workerを即座にアクティブにする
    self.skipWaiting();
});
/**
 * Service Workerのアクティベートイベント
 */
self.addEventListener('activate', () => {
    console.log('Service Worker: アクティベートされました');
});
/**
 * プッシュ通知を受け取った時のイベント
 */
self.addEventListener('push', (event) => {
    console.log('Service Worker: プッシュ通知を受信しました', event);

  // 通知のデータを取得（今回は固定のテキスト）
  // 本来は event.data.json() などでサーバーからのデータを取得します
    const title = 'ご褒美ポケット';
    const options = {
    body: 'こどもがお手伝いを終わらせました！',
    icon: `${BASE_URL}/images/192icon.png`, // 通知に表示するアイコン
    badge: `${BASE_URL}/images/money_96x96.png`// Androidで表示される小さなアイコン
    };

  // 通知を表示する
    event.waitUntil(
    self.registration.showNotification(title, options)
    );
});
/**
 * 通知をクリックした時のイベント
 */
self.addEventListener('notificationclick', (event) => {
    console.log('通知がクリックされました。', event.notification);
    // 通知を閉じる
    event.notification.close();

    // 特定のURLを開くなどのアクション
    event.waitUntil(
        clients.openWindow('')//デプロイ後のURL
    );
});