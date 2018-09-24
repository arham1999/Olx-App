var cacheName = 'v1';
var dynamicCacheName = 'v1-dynamic';
const staticAssets = [
    './',
    './adview.html',
    './bikes.html',
    './books.html',
    './cars.html',
    './electronics.html',
    './fashion.html',
    './furniture.html',
    './item.html',
    './jobs.html',
    './mobiles.html',
    './myads.html',
    './mychat.html',
    './mysellchat.html',
    './pets.html',
    './properties.html',
    './search.html',
    './signin.html',
    './signup.html',
    './submitad.html',
    './images/background.jpg',
    './images/fbicon.png',
    './images/instaicon.png',
    './images/msgicon.png',
    './images/olxlogo.jpg',
    './images/olxtitle.png',
    './images/twittericon.png',
    './images/usericon.png',
    './js/adview.js',
    './js/categoryadd.js',
    './js/firebase.js',
    './js/itemshow.js',
    './js/myads.js',
    './js/mychat.js',
    './js/mysellchat.js',
    './js/search.js',
    './js/showsearch.js',
    './js/sign.js',
    './js/signout.js',
    './js/submitad.js',
    './functions/index.js',
    './css/style.css',
    './css/main.css',
    './bootstrap/bootstrap.css',
    './bootstrap/bootstrap.min.css'
  ];
  
  self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(cacheName)
        .then(res => {
          console.log('wait.........!')
          return res.addAll(staticAssets);
        })
    );
    console.log('installed');
  });
  
  self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName && key !== dynamicCacheName) {
                    console.log('Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
  });
  
  self.addEventListener('fetch', (ev) => {
    if(ev.request.method !== 'GET') {
      return;
    }
    console.log('Fetch from Service Worker ', ev);
    const req = ev.request;
    const url = new URL(req.url);
    if (url.origin === location.origin) {
      ev.respondWith(cacheFirst(req));
    }
    try{
      return ev.respondWith(networkFirst(req));
    }catch {

    }
  });
  
  async function cacheFirst(req) {
    let cacheRes = await caches.match(req);
    return cacheRes || fetch(req);
  }
  
  async function networkFirst(req) {
    const dynamicCache = await caches.open(dynamicCacheName);
    try {
      const networkResponse = await fetch(req);
      dynamicCache.put(req, networkResponse.clone());
      return networkResponse;
    } catch (err) {
      const cacheResponse = await caches.match(req);
      return cacheResponse;
    }
  }