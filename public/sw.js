// public/sw.js

// Push notification handler
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || "You have a new update!",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      vibrate: [100, 50, 100],
      data: {
        url: data.url || "/", // deep link if passed
        dateOfArrival: Date.now(),
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "QuickBite QR", options)
    );
  }
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Open URL if provided in payload
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
