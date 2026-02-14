// app.js (Manual slides, no admin)
const STORE_KEY = "KK_MEMORIES_V3";

// ✅ password tetap shared lintas device
const SHARED_PASSWORD = "sayangku";

// ✅ isi kode romantis (dipakai surprise)
const REVEAL_CODE = "KITA-SELAMANYA";

// ✅ isi 5 slide manual di sini (edit sesukamu)
const MANUAL_SLIDES = [
  {
    title: "Halaman 1",
    text: "Ini awal cerita kita. Makasih ya udah hadir 🤍",
    photo: "img/1.jpg", // atau "" kalau tidak pakai foto
  },
  {
    title: "Halaman 2",
    text: "Aku suka caramu bikin hari-hariku jadi hangat 💗",
    photo: "img/2.jpg",
  },
  {
    title: "Halaman 3",
    text: "Kalau capek, sandar ya… aku ada di sini 🤍",
    photo: "img/3.jpg",
  },
  {
    title: "Halaman 4",
    text: "Kita pelan-pelan, tapi bareng-bareng ya 🌷",
    photo: "img/4.jpg",
  },
  {
    title: "Halaman 5",
    text: "Untuk semua hari yang sudah dan akan kita lewati… aku sayang kamu 💞",
    photo: "img/5.jpg",
  },
];

// ============ DATA (hanya untuk lastIndex) ============
function loadData() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return { lastIndex: 0 };
  try {
    const parsed = JSON.parse(raw);
    return { lastIndex: Number(parsed?.lastIndex || 0) };
  } catch {
    return { lastIndex: 0 };
  }
}
function saveData(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify({ lastIndex: data.lastIndex || 0 }));
}
function ensureSeed() {
  // cukup pastikan ada struktur minimal
  const d = loadData();
  saveData(d);
}

// supaya halaman lain tetap bisa akses slides & kode
function getSlides() {
  return MANUAL_SLIDES;
}
function getRevealCode() {
  return REVEAL_CODE;
}

// ============ AUTH ============
function guardAuthOrGoHome() {
  if (sessionStorage.getItem("KK_AUTH") === "1") return;
  window.location.href = "index.html";
}
async function verifyPassword(pw) {
  return String(pw || "").trim() === SHARED_PASSWORD;
}

// ============ UTIL ============
function makeCuteCode() {
  const list = ["KITA-SELAMANYA", "I💗U", "ONLY-US", "FOREVER-US", "JADIAN-♡"];
  return list[Math.floor(Math.random() * list.length)];
}
function shake(el) {
  el.classList.remove("shake");
  void el.offsetWidth;
  el.classList.add("shake");
}
function toast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.left = "50%";
  t.style.bottom = "22px";
  t.style.transform = "translateX(-50%)";
  t.style.padding = "10px 12px";
  t.style.borderRadius = "12px";
  t.style.border = "1px solid rgba(0,0,0,.08)";
  t.style.background = "rgba(255,255,255,.8)";
  t.style.backdropFilter = "blur(10px)";
  t.style.color = "#5a0033";
  t.style.zIndex = "9999";
  t.style.boxShadow = "0 14px 40px rgba(255,0,90,.18)";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1400);
}
function popConfetti() {
  const n = 40;
  for (let i = 0; i < n; i++) {
    const p = document.createElement("div");
    p.style.position = "fixed";
    p.style.left = (Math.random() * 100) + "vw";
    p.style.top = "-10px";
    p.style.width = "8px";
    p.style.height = "12px";
    p.style.borderRadius = "3px";
    p.style.background = `hsl(${Math.random() * 360}, 90%, 70%)`;
    p.style.opacity = "0.95";
    p.style.zIndex = "9999";
    p.style.transform = `rotate(${Math.random() * 80}deg)`;
    document.body.appendChild(p);

    const dur = 900 + Math.random() * 900;
    const drift = (Math.random() * 2 - 1) * 120;
    const endY = 80 + Math.random() * 20;

    const start = performance.now();
    (function anim(now) {
      const t = Math.min(1, (now - start) / dur);
      p.style.top = (t * endY) + "vh";
      p.style.left = `calc(${p.style.left} + ${drift * t}px)`;
      p.style.transform = `rotate(${t * 360}deg)`;
      p.style.opacity = String(1 - t);
      if (t < 1) requestAnimationFrame(anim);
      else p.remove();
    })(start);
  }
}

// ============ GLOBAL MUSIC ============
function initGlobalMusic() {
  if (window.top.__GLOBAL_BGM__) return;
  const audio = document.createElement("audio");
  audio.src = "music.mp3";
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;
  window.top.__GLOBAL_BGM__ = audio;
}
async function playGlobalMusic() {
  const audio = window.top.__GLOBAL_BGM__;
  if (!audio) return;
  if (!audio.paused) return;
  try {
    await audio.play();
    fadeInMusic(audio);
  } catch {
    throw new Error("Autoplay blocked");
  }
}
function fadeInMusic(audio) {
  let v = 0;
  const fade = setInterval(() => {
    v += 0.05;
    if (v >= 1) {
      v = 1;
      clearInterval(fade);
    }
    audio.volume = v;
  }, 200);
}
