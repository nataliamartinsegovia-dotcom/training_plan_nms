const CACHE = 'nms-training-v1';
const ASSETS = [
  '/training_plan_nms/',
    '/training_plan_nms/index.html',
      '/training_plan_nms/manifest.json',
        '/training_plan_nms/logotipo-pauta.svg',
          '/training_plan_nms/logotipo-pauta-inv.svg',
            '/training_plan_nms/favicon.svg',
              '/training_plan_nms/tokens.css'
              ];

              self.addEventListener('install', e => {
                e.waitUntil(
                    caches.open(CACHE).then(c => c.addAll(ASSETS))
                      );
                        self.skipWaiting();
                        });

                        self.addEventListener('activate', e => {
                          e.waitUntil(
                              caches.keys().then(keys =>
                                    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
                                        )
                                          );
                                            self.clients.claim();
                                            });

                                            self.addEventListener('fetch', e => {
                                              e.respondWith(
                                                  caches.match(e.request).then(cached => {
                                                        const network = fetch(e.request).then(res => {
                                                                if (res.ok) {
                                                                          const clone = res.clone();
                                                                                    caches.open(CACHE).then(c => c.put(e.request, clone));
                                                                                            }
                                                                                                    return res;
                                                                                                          });
                                                                                                                return cached || network;
                                                                                                                    })
                                                                                                                      );
                                                                                                                      });