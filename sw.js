// new-cpc service worker — network-first（pwa-offline 坑已解：cache-first 會卡舊版）
// 策略：line 上永遠拿最新；斷網時退回快取。改版只需 bump CACHE 版本。
const CACHE = 'new-cpc-v1';
const OFFLINE_FALLBACK = '/';

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll([OFFLINE_FALLBACK, '/manifest.webmanifest'])));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // 只接手同源 GET；API 呼叫（worker 網域）不快取
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(async () => (await caches.match(req)) || (await caches.match(OFFLINE_FALLBACK))),
  );
});
