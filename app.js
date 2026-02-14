// app.js (Manual slides, no admin)
const STORE_KEY = "KK_MEMORIES_V3";

// ✅ password tetap shared lintas device
const SHARED_PASSWORD = "sayangku";

// ✅ isi kode romantis (dipakai surprise)
const REVEAL_CODE = "LOPE YOU ASYA";

// ✅ isi 5 slide manual di sini (edit sesukamu)
const MANUAL_SLIDES = [
  {
    title: "Halaman 1",
    text: "Ini adalah kesayanganku, orang yang selalu berhasil bikin hari-hariku terasa lebih hidup. Entah kenapa, setiap kali aku ngobrol sama kamu, dunia terasa lebih tenang dan hangat. Kamu itu bukan cuma seseorang yang aku sayang, tapi juga rumah buat hati aku pulang. Aku bersyukur banget bisa punya kamu, karena kamu adalah alasan aku tersenyum tanpa sadar setiap hari.",
    photo: "img/1.jpg", // atau "" kalau tidak pakai foto
  },
  {
    title: "Halaman 2",
    text: "Kamu tahu nggak? Kamu itu kesayanganku yang paling aku jaga. Aku nggak pernah nyangka bisa nemuin seseorang yang bikin aku merasa cukup hanya dengan kehadirannya. Kamu nggak harus melakukan hal besar, cukup ada di samping aku saja sudah bikin semuanya terasa lebih baik. Aku sayang kamu bukan cuma karena siapa kamu, tapi karena kamu selalu membuat aku merasa dicintai dengan cara paling sederhana.",
    photo: "img/2.jpg",
  },
  {
    title: "Halaman 3",
    text: "Ini kesayanganku, orang yang selalu aku pikirin bahkan di tengah kesibukan sekalipun. Kamu itu seperti bagian kecil dari kebahagiaan yang selalu aku bawa ke mana pun aku pergi. Kadang aku cuma senyum sendiri karena inget kamu, karena rasanya hati ini selalu penuh kalau ada kamu. Aku harap kamu tahu, aku benar-benar tulus mencintai kamu, lebih dari yang bisa aku jelaskan dengan kata-kata.",
    photo: "img/3.jpg",
  },
  {
    title: "Halaman 4",
    text: "Kamu adalah kesayanganku, tempat ternyaman yang pernah aku temui. Aku suka cara kamu hadir dalam hidup aku, bukan dengan paksaan, tapi dengan ketulusan. Kamu itu seperti peluk yang nggak terlihat, tapi selalu bisa menenangkan. Aku ingin terus ada buat kamu, menemani kamu dalam setiap langkah, karena aku merasa hidupku lebih berarti sejak ada kamu.",
    photo: "img/4.jpg",
  },
  {
    title: "Halaman 5",
    text: "Ini adalah kesayanganku, orang yang aku pilih setiap hari tanpa ragu. Aku nggak peduli seberapa rumit dunia ini, selama aku punya kamu, semuanya terasa lebih ringan. Kamu adalah cerita favorit aku, kebahagiaan paling sederhana, dan cinta yang aku syukuri. Aku cuma ingin kamu tahu, aku bangga punya kamu, dan aku ingin terus mencintai kamu dengan cara yang paling tulus.",
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
