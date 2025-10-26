let birthdayDate = null;
let deferredPrompt = null;

function updateCountdown() {
  if (!birthdayDate) return;

  const now = new Date();
  let birthday = new Date(birthdayDate);

  birthday.setFullYear(now.getFullYear());
  if (birthday < now) {
    birthday.setFullYear(now.getFullYear() + 1);
  }

  const distance = birthday - now;
  const days = Math.ceil(distance / (1000 * 60 * 60 * 24));

  const daysEl = document.getElementById("days");
  const messageEl = document.getElementById("message");
  const countdownEl = document.getElementById("countdown");

  if (distance <= 0) {
    countdownEl.style.display = "none";
    messageEl.innerText = "🎉 Gefeliciteerd! 🎉";
  } else {
    countdownEl.style.display = "block";
    daysEl.innerText = days;
    messageEl.innerText = `Nog ${days} dagen tot je verjaardag`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const setBtn = document.getElementById("setBirthdayBtn");
  const input = document.getElementById("birthdayInput");
  const installBtn = document.getElementById("installBtn");

  // Verjaardag instellen
  setBtn.addEventListener("click", () => {
    if (input.value) {
      birthdayDate = input.value;
      updateCountdown();
    }
  });

  // Update elke seconde
  setInterval(updateCountdown, 1000);

  // Service worker registreren
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js")
      .then(() => console.log("Service Worker geregistreerd"))
      .catch(err => console.log("Service Worker fout", err));
  }

  // Installatie prompt
  window.addEventListener("beforeinstallprompt", (e) => {
    console.log("✅ beforeinstallprompt event fired");
    e.preventDefault();
    deferredPrompt = e;
  });

  // Installatieknop
  installBtn.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      console.log(outcome === "accepted" ? "✅ App geïnstalleerd!" : "❌ Installatie geweigerd");
    } else {
      alert("Chrome ziet de app nog niet als installable.\nControleer via F12 → Application → Manifest → Installable: Yes.");
    }
  });
});
