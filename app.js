// app.js
const STORE_KEY = "KK_MEMORIES_V2";

function defaultData() {
  return {
    passwordHash: "",        // sha256
    passwordPlain: "sayang", // plaintext (biar bisa ditampilkan di admin) - ini kurang aman, tapi OK untuk surprise
    revealCode: "KITA-SELAMANYA",
    lastIndex: 0,
    slides: [
      { title: "Halaman Pertama", text: "Ini awal cerita kita. Makasih ya udah hadir 🤍", photo: "" },
      { title: "Kenangan Manis", text: "Semoga kita terus bikin kenangan baru bareng 💗", photo: "" }
    ]
  };
}

function loadData() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function saveData(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

/**
 * FIX utama:
 * - Seed disimpan langsung (tidak nunggu sha256 async)
 * - Hash dibuat setelahnya (async) tanpa bikin data null
 */
function ensureSeed() {
  let data = loadData();

  if (!data) {
    data = defaultData();
    saveData(data);

    // isi hash async
    sha256(data.passwordPlain).then((h) => {
      const latest = loadData();
      if (!latest) return;
      latest.passwordHash = h;
      saveData(latest);
    });

    return;
  }

  // kalau data ada tapi hash kosong, perbaiki
  if (!data.passwordHash && data.passwordPlain) {
    sha256(data.passwordPlain).then((h) => {
      const latest = loadData();
      if (!latest) return;
      latest.passwordHash = h;
      saveData(latest);
    });
  }
}

function guardAuthOrGoHome() {
  if (sessionStorage.getItem("KK_AUTH") === "1") return;
  window.location.href = "index.html";
}

async function verifyPassword(pw) {
  ensureSeed();
  const data = loadData();
  if (!data) return false;

  // fallback kalau hash belum kebentuk
  if (!data.passwordHash && data.passwordPlain) {
    return pw === data.passwordPlain;
  }

  const hash = await sha256(pw);
  return hash === data.passwordHash;
}

function makeCuteCode() {
  const list = ["KITA-SELAMANYA", "I💗U", "ONLY-US", "FOREVER-US", "JADIAN-♡"];
  return list[Math.floor(Math.random() * list.length)];
}

async function sha256(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
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

function escapeHtml(s){
  return (s ?? "").replace(/[&<>"']/g, (m) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function popConfetti() {
  const n = 40;
  for (let i=0;i<n;i++){
    const p = document.createElement("div");
    p.style.position = "fixed";
    p.style.left = (Math.random()*100) + "vw";
    p.style.top = "-10px";
    p.style.width = "8px";
    p.style.height = "12px";
    p.style.borderRadius = "3px";
    p.style.background = `hsl(${Math.random()*360}, 90%, 70%)`;
    p.style.opacity = "0.95";
    p.style.zIndex = "9999";
    p.style.transform = `rotate(${Math.random()*80}deg)`;
    document.body.appendChild(p);

    const dur = 900 + Math.random()*900;
    const drift = (Math.random()*2-1) * 120;
    const endY = 80 + Math.random()*20;

    const start = performance.now();
    (function anim(now){
      const t = Math.min(1, (now-start)/dur);
      p.style.top = (t*endY) + "vh";
      p.style.left = `calc(${p.style.left} + ${drift*t}px)`;
      p.style.transform = `rotate(${t*360}deg)`;
      p.style.opacity = String(1 - t);
      if (t < 1) requestAnimationFrame(anim);
      else p.remove();
    })(start);
  }
}

// ==============================
// GLOBAL BACKGROUND MUSIC ENGINE
// ==============================
function initGlobalMusic() {
  if (window.top.__GLOBAL_BGM__) return; // sudah ada, jangan buat lagi

  const audio = document.createElement("audio");
  audio.src = "music.mp3";   // pastikan file ini ada
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0;

  window.top.__GLOBAL_BGM__ = audio;
}

async function playGlobalMusic() {
  const audio = window.top.__GLOBAL_BGM__;
  if (!audio) return;

  if (!audio.paused) return; // sudah jalan

  try {
    await audio.play();
    fadeInMusic(audio);
  } catch {
    console.log("Autoplay diblok, tunggu interaksi user.");
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
