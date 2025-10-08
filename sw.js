// Service Worker for 傳藝園區AI小幫手
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `chuanyii-ai-${CACHE_VERSION}`;

// 需要快取的檔案
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  './logo.png',
  './3c25cb87ae.png',
  './參觀資訊.png',
  './展覽.png',
  './表演.png',
  './NotoSerifHK-SemiBold.ttf'
];

// 安裝 Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...', CACHE_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// 啟用 Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating new Service Worker...', CACHE_VERSION);
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 刪除舊版本的快取
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 攔截請求 - Network First 策略（優先網路，失敗才用快取）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 檢查是否為有效回應
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // 複製回應並更新快取
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      })
      .catch(() => {
        // 網路失敗時，使用快取
        return caches.match(event.request);
      })
  );
});

