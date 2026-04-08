/* coi-serviceworker v0.1.7 - https://github.com/gzuidhof/coi-serviceworker */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

async function handleFetch(request) {
  if (request.cache === "only-if-cached" && request.mode !== "same-origin") return;
  const r = await fetch(request).catch(() => fetch(request));
  if (r.status === 0) return r;
  const headers = new Headers(r.headers);
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  headers.set("Cross-Origin-Resource-Policy", "cross-origin");
  return new Response(r.body, { status: r.status, statusText: r.statusText, headers });
}

self.addEventListener("fetch", (event) => event.respondWith(handleFetch(event.request)));
