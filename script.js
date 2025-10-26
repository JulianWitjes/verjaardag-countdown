let birthdayDate = null;

function updateCountdown() {
  if (!birthdayDate) return; // Niets doen als geen datum ingesteld

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

// Start wanneer de DOM klaar is
document.addEventListener("DOMContentLoaded", () => {
  // Button listener
  document.getElementById("setBirthdayBtn").addEventListener("click", () => {
    const input = document.getElementById("birthdayInput").value;
    if (input) {
      birthdayDate = input;
      updateCountdown();
    }
  });

  // Update elke seconde
  setInterval(updateCountdown, 1000);

  // Service Worker registreren
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js")
      .then(() => console.log("Service Worker geregistreerd"))
      .catch(err => console.log("Service Worker fout", err));
  }
});
