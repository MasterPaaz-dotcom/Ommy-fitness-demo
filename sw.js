// sw.js — offline. Ukibadilisha videos au config, ongeza namba ya VERSION ili simu zichukue mpya.
importScripts("config.js");
var VERSION = "v2";
var CACHE = "emom-" + VERSION;
var SHELL = ["./", "index.html", "app.js", "config.js", "manifest.webmanifest", "icon-192.png", "icon-512.png", "logo.jpg"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (cache) {
    var files = SHELL.concat(self.TRAINER.exercises.map(function (x) { return x.video; }));
    // kila faili peke yake, ili faili linalokosekana (mf. logo.png) lisivunje zingine
    return Promise.all(files.map(function (f) { return cache.add(f).catch(function () {}); }));
  }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

function rangeResponse(req, res) {
  return res.arrayBuffer().then(function (buf) {
    var m = /bytes=(\d+)-(\d*)/.exec(req.headers.get("range"));
    var start = +m[1], end = m[2] ? +m[2] : buf.byteLength - 1;
    return new Response(buf.slice(start, end + 1), {
      status: 206,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "video/mp4",
        "Content-Range": "bytes " + start + "-" + end + "/" + buf.byteLength,
        "Content-Length": String(end - start + 1)
      }
    });
  });
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  var isMedia = /\.(mp4|webm|png|jpg|jpeg|svg)$/i.test(new URL(req.url).pathname);

  if (isMedia) {
    // cache kwanza (videos nzito)
    e.respondWith(caches.match(req.url).then(function (hit) {
      if (hit) return req.headers.has("range") ? rangeResponse(req, hit) : hit;
      return fetch(req);
    }));
    return;
  }
  // html/js/config: mtandao kwanza, cache ikishindikana
  e.respondWith(fetch(req).then(function (res) {
    var copy = res.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copy); });
    return res;
  }).catch(function () { return caches.match(req, { ignoreSearch: true }); }));
});
