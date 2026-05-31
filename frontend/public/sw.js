// Service Worker for HYDRA – AI Hydration & Fatigue Detector Web Push Notifications

self.addEventListener('push', (event) => {
  let data = { title: 'Hydration Alert', body: 'Remember to take a sip of water!' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Hydration Alert', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💧</text></svg>',
    badge: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💧</text></svg>',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      { action: 'drink', title: 'Logged +250ml Water' },
      { action: 'close', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'drink') {
    // If they clicked Logged +250ml directly from native alert, we can log water!
    // In actual production, we can run a background fetch call.
    console.log("Logged 250ml via notification trigger.");
  }
});
