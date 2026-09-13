/* Coolum — offline service worker.
   Bump VERSION whenever the cached file list changes; the old cache is
   dropped on activate. */
const VERSION = 'v5';
const CACHE = 'coolum-' + VERSION;

const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&display=swap';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-32.png',
  './icons/icon-180-apple.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png',
  // photos and list thumbnails, so the app still has them with no signal
  './img/b1-2.jpg',
  './img/b1-3.jpg',
  './img/b1-4.jpg',
  './img/b1.jpg',
  './img/b3-2.jpg',
  './img/b3.jpg',
  './img/b4-2.jpg',
  './img/b4-3.jpg',
  './img/b4.jpg',
  './img/b5-2.jpg',
  './img/b5-3.jpg',
  './img/b5-4.jpg',
  './img/b5.jpg',
  './img/k1-2.jpg',
  './img/k1-3.jpg',
  './img/k1-4.jpg',
  './img/k1.jpg',
  './img/k3-2.jpg',
  './img/k3-3.jpg',
  './img/k3-4.jpg',
  './img/k3.jpg',
  './img/k4.jpg',
  './img/k6-2.jpg',
  './img/k6-3.jpg',
  './img/k6.jpg',
  './img/k7-2.jpg',
  './img/k7-3.jpg',
  './img/k7-4.jpg',
  './img/k7.jpg',
  './img/n1-2.jpg',
  './img/n1-3.jpg',
  './img/n1.jpg',
  './img/p1-2.jpg',
  './img/p1-3.jpg',
  './img/p1-4.jpg',
  './img/p1.jpg',
  './img/p2-2.jpg',
  './img/p2-3.jpg',
  './img/p2-4.jpg',
  './img/p2.jpg',
  './img/p3-2.jpg',
  './img/p3-3.jpg',
  './img/p3.jpg',
  './img/p5-2.jpg',
  './img/p5-3.jpg',
  './img/p5-4.jpg',
  './img/p5.jpg',
  './img/r2-2.jpg',
  './img/r2-3.jpg',
  './img/r2-4.jpg',
  './img/r2.jpg',
  './img/r4-2.jpg',
  './img/r4-3.jpg',
  './img/r4.jpg',
  './img/s1-2.jpg',
  './img/s1-3.jpg',
  './img/s1.jpg',
  './img/s2-2.jpg',
  './img/s2.jpg',
  './img/s3.jpg',
  './img/s4-2.jpg',
  './img/s4-3.jpg',
  './img/s4-4.jpg',
  './img/s4.jpg',
  './img/s5-2.jpg',
  './img/s5-3.jpg',
  './img/s5.jpg',
  './img/s7-2.jpg',
  './img/s7-3.jpg',
  './img/s7-4.jpg',
  './img/s7.jpg',
  './img/s8-2.jpg',
  './img/s8.jpg',
  './img/t1-2.jpg',
  './img/t1.jpg',
  './img/t2-2.jpg',
  './img/t2.jpg',
  './img/t8-2.jpg',
  './img/t8-3.jpg',
  './img/t8-4.jpg',
  './img/t8.jpg',
  './img/w1-2.jpg',
  './img/w1-3.jpg',
  './img/w1-4.jpg',
  './img/w1.jpg',
  './img/w3-2.jpg',
  './img/w3.jpg',
  './img/w4-2.jpg',
  './img/w4.jpg',
  './img/w5-2.jpg',
  './img/w5-3.jpg',
  './img/w5.jpg',
  './img/t/b1.jpg',
  './img/t/b3.jpg',
  './img/t/b4.jpg',
  './img/t/b5.jpg',
  './img/t/k1.jpg',
  './img/t/k3.jpg',
  './img/t/k4.jpg',
  './img/t/k6.jpg',
  './img/t/k7.jpg',
  './img/t/n1.jpg',
  './img/t/p1.jpg',
  './img/t/p2.jpg',
  './img/t/p3.jpg',
  './img/t/p5.jpg',
  './img/t/r2.jpg',
  './img/t/r4.jpg',
  './img/t/s1.jpg',
  './img/t/s2.jpg',
  './img/t/s3.jpg',
  './img/t/s4.jpg',
  './img/t/s5.jpg',
  './img/t/s7.jpg',
  './img/t/s8.jpg',
  './img/t/t1.jpg',
  './img/t/t2.jpg',
  './img/t/t8.jpg',
  './img/t/w1.jpg',
  './img/t/w3.jpg',
  './img/t/w4.jpg',
  './img/t/w5.jpg'
];

const isFont = u => u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';

/* Pull down the Google Fonts stylesheet and the woff2 files it points at, so
   the display face survives a week with no signal rather than waiting to be
   cached opportunistically. */
async function precacheFonts(cache) {
  try {
    const res = await fetch(FONT_CSS, { mode: 'cors' });
    if (!res.ok) return;
    const css = (await res.clone().text()) || '';
    await cache.put(FONT_CSS, res);
    const urls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)\s"']+/g) || [])];
    await Promise.all(urls.map(async u => {
      try {
        const f = await fetch(u, { mode: 'cors' });
        if (f.ok) await cache.put(u, f);
      } catch (e) {}
    }));
  } catch (e) {}
}

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // one at a time: a single 404 shouldn't sink the whole install
    await Promise.all(PRECACHE.map(u => cache.add(u).catch(() => {})));
    await precacheFonts(cache);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('coolum-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (err) { return; }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;

  const sameOrigin = url.origin === self.location.origin;

  // Leave Maps, TripAdvisor and every other outbound link alone.
  if (!sameOrigin && !isFont(url)) return;

  // The page itself: freshest copy when there's signal, cache when there isn't.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const net = await fetch(req);
        const cache = await caches.open(CACHE);
        cache.put('./index.html', net.clone());
        return net;
      } catch (err) {
        const cache = await caches.open(CACHE);
        return (await cache.match('./index.html', { ignoreSearch: true }))
            || (await cache.match('./', { ignoreSearch: true }))
            || Response.error();
      }
    })());
    return;
  }

  // Everything else — icons, photos, fonts: cache first, refresh behind you.
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreVary: true });
    if (hit) {
      e.waitUntil((async () => {
        try {
          const net = await fetch(req);
          if (net && net.ok) await cache.put(req, net);
        } catch (err) {}
      })());
      return hit;
    }
    try {
      const net = await fetch(req);
      if (net && net.ok) cache.put(req, net.clone());
      return net;
    } catch (err) {
      return Response.error();
    }
  })());
});
