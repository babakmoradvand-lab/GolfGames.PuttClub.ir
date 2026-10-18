const CACHE='golf1-hook-slice-golf2-preview-v6';
const FILES=['./','./index.html','./golf2-preview.html','./game.js','./manifest.webmanifest','./three.module.js','./three.core.js','./jsm/loaders/GLTFLoader.js','./jsm/utils/BufferGeometryUtils.js','./jsm/utils/SkeletonUtils.js','./assets/golfer.glb','./assets/boot_resort.png','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(cache=>cache.put(e.request,copy))}return r}))) });
