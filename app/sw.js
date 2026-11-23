const C='stundenplan-v4', F=['./','index.html','manifest.webmanifest','apple-touch-icon.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
/* cache first: the app keeps working even if the website goes offline or the repo turns private */
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>{
    const net=fetch(e.request).then(r=>{ if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));} return r; }).catch(()=>null);
    return hit || net.then(r=>r||caches.match('index.html'));
  }));
});
