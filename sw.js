// スマホにインストールするための小さな仕組み（Ver 2.0）
// 同じ倉庫のページだけ、ネットから取れないときに前に見た版を出す。地図や写真には手を出さない。
const CACHE = 'shukuba-map-v2.0';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(req, c)); }
    return res;
  }).catch(() => caches.match(req, { ignoreSearch: true })));
});
