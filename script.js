let birthdayDate = null;
let deferredPrompt = null;

function updateCountdown() {
  if (!birthdayDate) return;

  const now = new Date();
  let birthday = new Date(birthdayDate);

  // Als verjaardag al geweest is, pak volgend jaar
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

  // Datum instellen
  setBtn.addEventListener("click", () => {
    if (input.value) {
      birthdayDate = input.value;
      updateCountdown();
    }
  });

  // Update countdown elke seconde
  setInterval(updateCountdown, 1000);

  // Service Worker registreren
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js")
      .then(() => console.log("Service Worker geregistreerd"))
      .catch(err => console.log("Service Worker fout", err));
  }

  // Installatie prompt event (Chrome/Edge)
  window.addEventListener("beforeinstallprompt", (e) => {
    console.log("beforeinstallprompt event fired!");
    e.preventDefault(); // voorkom automatische prompt
    deferredPrompt = e;
  });

  // Installatieknop altijd zichtbaar
  installBtn.addEventListener("click", async () => {
    if (deferredPrompt) {
      // Chrome/Edge: toon officiële prompt
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      console.log(outcome === "accepted" ? "App geïnstalleerd!" : "Installatie geweigerd");
    } else {
      // App nog niet installable of iOS: instructie tonen
      alert("De app kan nu nog niet automatisch geïnstalleerd worden.\nOp iOS gebruik: 'Delen' → 'Zet op beginscherm'.\nOp Chrome/Edge, herlaad de pagina en probeer opnieuw.");
    }
  });
});
