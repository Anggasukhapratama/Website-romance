// surprise.js
ensureSeed();
guardAuthOrGoHome();

// musik global (loop & lanjut lintas halaman)
initGlobalMusic();

const arena = document.getElementById("btnArena");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");

const unlock = document.getElementById("unlock");
const bar = document.getElementById("bar");
const codeText = document.getElementById("codeText");
const codeValue = document.getElementById("codeValue");
const openBook = document.getElementById("openBook");

const audioGate = document.getElementById("audioGate");
const startMusicBtn = document.getElementById("startMusic");

// ========= MUSIK =========
async function ensureMusicPlaying() {
  try {
    await playGlobalMusic();
    audioGate.classList.add("hidden");
  } catch {
    audioGate.classList.remove("hidden");
  }
}

window.addEventListener("load", ensureMusicPlaying);

startMusicBtn.addEventListener("click", async () => {
  await playGlobalMusic();
  audioGate.classList.add("hidden");
  toast("Musik dimulai 💖");
});

// fallback: tap di mana saja untuk mulai
document.addEventListener("pointerdown", async () => {
  await playGlobalMusic();
  audioGate.classList.add("hidden");
}, { once: true });

// ========= POSISI AWAL NO DI SAMPING YES =========
function placeNoBesideYes() {
  const r = arena.getBoundingClientRect();

  // titik pusat arena
  const cx = r.width / 2;
  const cy = r.height / 2;

  // taruh NO di kanan YES (offset)
  const offsetX = 140;
  const x = Math.min(r.width - noBtn.offsetWidth - 12, cx + offsetX - noBtn.offsetWidth / 2);
  const y = cy - noBtn.offsetHeight / 2;

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

// ========= NO KABUR (HINDARI ZONA YES) =========
function placeNoRandomAvoidCenter() {
  const r = arena.getBoundingClientRect();
  const bw = noBtn.offsetWidth || 110;
  const bh = noBtn.offsetHeight || 44;

  const pad = 12;

  // zona larangan di sekitar YES (tengah)
  const forbid = { x: r.width/2, y: r.height/2, rx: 140, ry: 70 };

  let x, y;
  for (let tries=0; tries<40; tries++) {
    const maxX = r.width - bw - pad*2;
    const maxY = r.height - bh - pad*2;

    x = pad + Math.random() * Math.max(0, maxX);
    y = pad + Math.random() * Math.max(0, maxY);

    const cx = x + bw/2;
    const cy = y + bh/2;

    const inForbidden = Math.abs(cx - forbid.x) < forbid.rx && Math.abs(cy - forbid.y) < forbid.ry;
    if (!inForbidden) break;
  }

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
  noBtn.style.transition = "all 120ms ease";
}

// kabur kalau didekati
noBtn.addEventListener("mouseenter", placeNoRandomAvoidCenter);
noBtn.addEventListener("pointerdown", (e) => { e.preventDefault(); placeNoRandomAvoidCenter(); });

// extra tricky: kalau mouse mendekat tombol
arena.addEventListener("mousemove", (e) => {
  const nb = noBtn.getBoundingClientRect();
  const dx = e.clientX - (nb.left + nb.width/2);
  const dy = e.clientY - (nb.top + nb.height/2);
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist < 110) placeNoRandomAvoidCenter();
});

// set posisi awal setelah layout siap
setTimeout(() => {
  placeNoBesideYes();
}, 120);

// ========= YES -> UNLOCK =========
yesBtn.addEventListener("click", () => {
  yesBtn.disabled = true;

  unlock.classList.remove("hidden");
  bar.style.width = "0%";
  codeText.classList.add("hidden");
  openBook.classList.add("hidden");

  const data = loadData();
  const code = (getRevealCode() || "").trim() || makeCuteCode();
  codeValue.textContent = code;

  let p = 0;
  const timer = setInterval(() => {
    p += Math.random() * 14 + 7;
    if (p >= 100) p = 100;
    bar.style.width = p + "%";

    if (p >= 100) {
      clearInterval(timer);
      codeText.classList.remove("hidden");
      openBook.classList.remove("hidden");
      popConfetti();
      toast("Terbuka! 💞");
    }
  }, 170);
});

openBook.addEventListener("click", () => {
  window.location.href = "book.html";
});
