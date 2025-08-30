self.addEventListener('push', (event) => {
  const data = (() => {
    try { return event.data?.json() || {}; } catch { return {}; }
  })();

  event.waitUntil(
    self.registration.showNotification(data.title || 'Order update', {
      body: data.body || '',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      data: data.data || {},
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.url;
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
