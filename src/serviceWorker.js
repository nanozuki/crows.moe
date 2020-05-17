window.self.addEventListener('install', () => {
  window.self.skipWaiting();
});

window.self.addEventListener('activate', () => {
  window.self.registration.unregister()
    .then(() => window.self.clients.matchAll())
    .then((clients) => {
      clients.forEach((client) => client.navigate(client.url));
    });
});
