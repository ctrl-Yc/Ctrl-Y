// これを main.js の内容全体と置き換えてください

const requestPermissionButton = document.getElementById('request-permission-button');
const sendNotificationButton = document.getElementById('send-notification-button');

// VAPID公開鍵
const VAPID_PUBLIC_KEY = 'BJI-8poQYapHkP_ao98GFzctHKUG-ILAd_4BeBwwTy2PHsbcEMgE4RvWHo9ID-peTlbPY59cNgp2iK3SFigHGDA';

/**
 * 文字列をUint8Arrayに変換するヘルパー関数
 */
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/**
 * メインの処理
 */
async function main() {
    // 1. Service WorkerとPush APIが利用可能かチェック
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('プッシュ通知はサポートされていません');
        requestPermissionButton.textContent = 'プッシュ通知はサポートされていません';
        requestPermissionButton.disabled = true;
        return;
    }

    // 2. Service Workerの登録
    try {
        const swRegistration = await navigator.serviceWorker.register('sw.js');
        console.log('Service Workerの登録に成功:', swRegistration);
    } catch (error) {
        console.error('Service Workerの登録に失敗:', error);
        return;
    }

    // 「通知を許可する」ボタンのクリック処理
    requestPermissionButton.addEventListener('click', async () => {
        try {
            // 3. 通知の許可をリクエスト
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.log('通知が許可されませんでした。');
                return;
            }
            console.log('通知が許可されました。');

            // 4. プッシュ通知の購読
            const swRegistration = await navigator.serviceWorker.ready;
            const subscription = await swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            console.log('プッシュ通知の購読に成功しました:', subscription);
            
            // ★★★ 修正箇所 ★★★
            // 購読情報をサーバーに送信し、成功したら「通知送信ボタン」を表示する
            fetch('http://localhost:5001/api/subscribe', {
                method: 'POST',
                body: JSON.stringify(subscription),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    console.log('サーバーへの購読情報送信に成功しました。');
                    sendNotificationButton.style.display = 'block'; // ボタンを表示
                } else {
                    console.error('サーバーへの購読情報送信に失敗しました。');
                }
            })
            .catch(error => console.error('購読情報の送信中にエラー:', error));
            
            requestPermissionButton.textContent = '通知が有効です';
            requestPermissionButton.disabled = true;

        } catch (error) {
            console.error('処理中にエラーが発生しました:', error);
        }
    });

    // 「サーバーから通知を送信」ボタンのクリック処理
    sendNotificationButton.addEventListener('click', async () => {
        try {
            const response = await fetch('http://localhost:5001/api/send-notification', {
                method: 'POST'
            });
            if (response.ok) {
                console.log('通知送信リクエスト成功');
            } else {
                console.error('通知送信リクエスト失敗');
            }
        } catch (error) {
            console.error('通知送信リクエストでエラー:', error);
        }
    });
}
// メイン処理を実行
main();