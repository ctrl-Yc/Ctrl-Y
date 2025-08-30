const BASE_URL = 'http://localhost:5173/';
const LOGIN_URL = 'http://localhost:5173/'

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'ご褒美ポケット';
  const options = {
    body: data.body || 'こどもがお手伝いを終わらせました！',
    icon: data.icon || `${BASE_URL}/images/192icon.png`,
    badge: data.badge || `${LOGIN_URL}/images/money_96x96.png`,
    data: {
      url:  LOGIN_URL
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  console.log('通知がクリックされました。', event.notification);
  event.notification.close();

  const urlToOpen = event.notification.data?.url || 'http://localhost:5173/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      };
    })
  );
});