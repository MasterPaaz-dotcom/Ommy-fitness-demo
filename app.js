(function () {
  "use strict";
  var T = self.TRAINER, S = T.text;
  var q = new URLSearchParams(location.search);

  // ---- brand na rangi (?brand=Jina&color=C6E41B) ----
  var brandParam = (q.get("brand") || "").trim().slice(0, 40);
  var brand = brandParam || T.brand;
  var c = (q.get("color") || "").replace("#", "");
  var color = /^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c) ? "#" + c : T.color;
  var root = document.documentElement;
  root.style.setProperty("--accent", color);
  root.style.setProperty("--on-accent", luminance(color) > 0.5 ? "#000" : "#fff");
  document.title = brand;

  function luminance(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map(function (x) { return x + x; }).join("");
    var v = [0, 2, 4].map(function (i) {
      var x = parseInt(hex.substr(i, 2), 16) / 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
  }

  // ---- helpers ----
  function el(tag, props) {
    var n = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (k === "class") n.className = v;
      else if (k.indexOf("on") === 0) n.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) n.setAttribute(k, v);
    });
    for (var i = 2; i < arguments.length; i++) {
      var kid = arguments[i];
      if (kid != null) n.append(kid);
    }
    return n;
  }
  function mmss(s) { return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }
  function vid(src) {
    var v = el("video", { playsinline: "", preload: "metadata" });
    v.muted = true; v.loop = true; v.playsInline = true;
    v.addEventListener("error", function () {
      v.classList.add("missing");
      if (q.has("debug") && v.parentNode) v.parentNode.setAttribute("data-miss", v.getAttribute("src"));
    });
    v.src = src;
    return v;
  }
  var storeKey = "emom_done_" + brand.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  function doneCount() { try { return +localStorage.getItem(storeKey) || 0; } catch (e) { return 0; } }
  function bumpDone() { try { localStorage.setItem(storeKey, String(doneCount() + 1)); } catch (e) {} }

  // ---- sauti, mtetemo, screen wake ----
  var SP = T.speech || {};
  var soundOn = true;
  try { soundOn = localStorage.getItem("emom_sound") !== "off"; } catch (e) {}
  function say(text) {
    if (!soundOn || !text || !("speechSynthesis" in window)) return;
    try {
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = SP.lang || "en-US";
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  function announce() {
    var s = steps[idx];
    var pre = s.i === 0 ? (SP.round || "Round") + " " + s.r + ". " : "";
    say(pre + s.ex.name + ". " + s.ex.reps + " " + (SP.reps || "reps"));
  }
  var ac;
  function initAudio() {
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.resume) ac.resume(); } catch (e) {}
  }
  function beep(freq, dur, when) {
    if (!ac || !soundOn) return;
    try {
      var o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = freq; o.connect(g); g.connect(ac.destination);
      var t = ac.currentTime + (when || 0);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.4, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t); o.stop(t + dur + 0.02);
    } catch (e) {}
  }
  function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  var wl = null;
  function lock() {
    try {
      if ("wakeLock" in navigator && !wl) {
        navigator.wakeLock.request("screen").then(function (l) {
          wl = l; l.addEventListener("release", function () { wl = null; });
        }).catch(function () {});
      }
    } catch (e) {}
  }
  function unlock() { try { if (wl) wl.release(); } catch (e) {} wl = null; }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible" && running) lock();
  });

  // ---- hali ya mazoezi ----
  var app = document.getElementById("app");
  var steps = [];
  for (var r = 1; r <= T.rounds; r++) {
    T.exercises.forEach(function (ex, i) { steps.push({ r: r, i: i, ex: ex }); });
  }
  var total = T.secondsPerExercise * 1000;
  var idx = 0, leftMs = total, endAt = 0, running = false, timer = null, lastBeep = -1, lastSaid = -1, P = {};

  function header() {
    var h = el("div", { class: "head" });
    if (!brandParam && T.logo) {
      var img = el("img", { src: T.logo, alt: brand, class: "logo" });
      img.addEventListener("error", function () { img.replaceWith(el("span", { class: "wordmark" }, brand)); });
      h.append(img);
    } else {
      h.append(el("span", { class: "wordmark" }, brand));
    }
    return h;
  }

  // ---- skrini ya kwanza ----
  function showHome() {
    clearInterval(timer); running = false; unlock();
    var mins = Math.round(steps.length * T.secondsPerExercise / 60);
    var list = el("ul", { class: "list" });
    T.exercises.forEach(function (ex) {
      var v = vid(ex.video + "#t=0.1");
      list.append(el("li", { class: "row" },
        el("div", { class: "thumb" }, v),
        el("div", { class: "info" }, el("div", { class: "rname" }, ex.name), el("div", { class: "rreps" }, ex.reps + " " + S.reps))
      ));
    });
    var n = doneCount();
    app.replaceChildren.apply(app, [
      header(),
      el("h1", {}, T.workoutName),
      el("p", { class: "meta" }, T.exercises.length + " " + S.exercises + ", " + S.round.toLowerCase() + " " + T.rounds + ", " + mins + " " + S.minutes),
      list,
      n ? el("p", { class: "meta" }, S.doneCount + ": " + n) : null,
      el("div", { class: "cta" }, el("button", { class: "btn", onclick: startWorkout }, S.start))
    ].filter(Boolean));
  }

  // ---- player ----
  function startWorkout() {
    initAudio(); lock();
    idx = 0; leftMs = total; lastBeep = -1;
    lastSaid = -1; showPlayer(); setStep(); play(); beep(988, 0.3); buzz(200); announce();
  }
  function showPlayer() {
    P.round = el("span"); P.step = el("span");
    P.sound = el("button", { class: "snd", onclick: toggleSound });
    P.stage = el("div", { class: "stage" }, el("span", { class: "ph" }, S.videoSoon));
    P.name = el("div", { class: "name" });
    P.repsNum = el("b");
    P.time = el("div", { class: "time" });
    P.bar = el("i");
    P.next = el("div", { class: "next" });
    P.toggle = el("button", { class: "btn", onclick: toggle });
    app.replaceChildren(
      el("div", { class: "top" }, P.round, P.step, P.sound),
      P.stage,
      P.name,
      el("div", { class: "repsrow" }, el("div", { class: "reps" }, P.repsNum, el("span", {}, " " + S.reps)), P.time),
      el("div", { class: "bar" }, P.bar),
      P.next,
      el("div", { class: "controls" },
        P.toggle,
        el("button", { class: "btn ghost", onclick: next }, S.skip),
        el("button", { class: "btn ghost", onclick: endNow }, S.end))
    );
  }
  function setStep() {
    var s = steps[idx];
    P.round.textContent = S.round + " " + s.r + "/" + T.rounds;
    P.step.textContent = S.exercise + " " + (s.i + 1) + "/" + T.exercises.length;
    P.name.textContent = s.ex.name;
    P.repsNum.textContent = s.ex.reps;
    P.next.textContent = idx + 1 < steps.length ? S.next + ": " + steps[idx + 1].ex.name : S.last;
    var old = P.stage.querySelector("video");
    if (old) old.remove();
    var v = vid(s.ex.video);
    v.autoplay = true;
    P.stage.append(v);
    if (running || idx === 0) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    render(leftMs);
  }
  function render(ms) {
    var secs = Math.max(0, Math.ceil(ms / 1000));
    P.time.textContent = mmss(secs);
    P.bar.style.width = Math.min(100, (1 - ms / total) * 100) + "%";
    P.toggle.textContent = running ? S.pause : S.resume;
    P.sound.textContent = soundOn ? S.soundOn : S.soundOff;
  }
  function toggleSound() {
    soundOn = !soundOn;
    try { localStorage.setItem("emom_sound", soundOn ? "on" : "off"); } catch (e) {}
    if (!soundOn && "speechSynthesis" in window) speechSynthesis.cancel();
    render(running ? Math.max(0, endAt - Date.now()) : leftMs);
  }
  function play() {
    running = true; endAt = Date.now() + leftMs; lastBeep = -1;
    clearInterval(timer); timer = setInterval(tick, 200);
    var v = P.stage.querySelector("video"); if (v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    render(leftMs);
  }
  function pause() {
    running = false; leftMs = Math.max(0, endAt - Date.now()); clearInterval(timer);
    var v = P.stage.querySelector("video"); if (v) v.pause();
    render(leftMs);
  }
  function toggle() { initAudio(); running ? pause() : play(); }
  function tick() {
    var left = endAt - Date.now();
    var secs = Math.ceil(left / 1000);
    if (left <= 0) { next(); return; }
    if (secs === 5 && lastSaid !== idx && idx + 1 < steps.length) { lastSaid = idx; say((SP.next || "Next") + ": " + steps[idx + 1].ex.name); }
    if (secs <= 3 && secs !== lastBeep) { lastBeep = secs; beep(660, 0.1); buzz(40); }
    render(left);
  }
  function next() {
    idx++;
    if (idx >= steps.length) { finish(); return; }
    leftMs = total; lastBeep = -1;
    var wasRunning = running;
    setStep();
    if (wasRunning) { endAt = Date.now() + leftMs; }
    beep(988, 0.3); buzz(200); announce();
  }
  function endNow() { if (confirm(S.endConfirm)) showHome(); }
  function finish() {
    clearInterval(timer); running = false; unlock();
    bumpDone(); say(SP.done || "Well done"); beep(784, 0.15); beep(988, 0.15, 0.2); beep(1175, 0.35, 0.4); buzz([200, 100, 200, 100, 400]);
    var mins = Math.round(steps.length * T.secondsPerExercise / 60);
    app.replaceChildren(
      header(),
      el("div", { class: "done" },
        el("h1", {}, S.doneTitle),
        el("div", { class: "reps" }, el("b", {}, String(mins)), el("span", {}, " " + S.minutes)),
        el("p", { class: "meta" }, S.doneCount + ": " + doneCount())
      ),
      el("div", { class: "cta" },
        el("button", { class: "btn", onclick: startWorkout }, S.again),
        el("button", { class: "btn ghost", onclick: showHome }, S.home))
    );
  }

  showHome();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(function () {});
})();
