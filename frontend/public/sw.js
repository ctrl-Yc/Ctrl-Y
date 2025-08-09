const BASE_URL = 'https://your-deployed-url.com';

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'ご褒美ポケット';
  const options = {
    body: data.body || 'こどもがお手伝いを終わらせました！',
    icon: data.icon || `${BASE_URL}/images/192icon.png`,
    badge: data.badge || `${BASE_URL}/images/money_96x96.png`,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  console.log('通知がクリックされました。', event.notification);
  event.notification.close();

  event.waitUntil(
    self.clients.openWindow(BASE_URL) 
  );
});
