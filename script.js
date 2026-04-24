const countdownEl = document.getElementById("countdown");

let partyStarted = false;
let fireworksRunning = false;

// 🇬🇷 17.05.2026 08:00 deutsche Zeit
const targetDate = new Date("2026-05-17T08:00:00+02:00");

function updateCountdown() {
  if (!countdownEl) return;

  const now = new Date();
  const diff = targetDate - now;

  // 🎉 PARTY START
  if (diff <= 0) {

    if (!partyStarted) {
      partyStarted = true;

      countdownEl.innerHTML = "🎉 Es geht los! Guten Flug! 🇬🇷";

      activatePartyMode();
      startFireworks();
    }

    return;
  }

  // ⏳ Countdown
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownEl.innerHTML =
    `${days} Tage ${hours} Std ${minutes} Min ${seconds} Sek`;
}

// 🔄 Loop
setInterval(updateCountdown, 1000);
updateCountdown();

// 🎆 FIREWORKS
function startFireworks() {
  if (fireworksRunning) return; // 🔥 verhindert doppelt starten
  fireworksRunning = true;

  const canvas = document.getElementById("fireworks");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let particles = [];

  function createFirework() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * (canvas.height / 2);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x,
        y,
        angle: Math.random() * 2 * Math.PI,
        speed: Math.random() * 6,
        life: 100,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`
      });
    }
  }

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.life--;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 2, 2);

      if (p.life <= 0) particles.splice(i, 1);
    });

    // 🎆 Frequenz
    if (partyStarted) {
      if (Math.random() < 0.15) createFirework();
    } else {
      if (Math.random() < 0.05) createFirework();
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// 📦 Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then(() => console.log("Service Worker registriert"))
      .catch(err => console.log("SW Fehler:", err));
  });
}

// 📱 Splash Screen
window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  if (!splash) return;

  setTimeout(() => {
    splash.style.opacity = "0";
    splash.style.transition = "opacity 0.6s ease";

    setTimeout(() => splash.remove(), 600);
  }, 1500);
});

// 📳 PARTY MODE
function activatePartyMode() {
  document.body.classList.add("party");

  // 📳 Android Vibration
  if ("vibrate" in navigator) {
    navigator.vibrate([300, 100, 300, 100, 500]);
  }
}