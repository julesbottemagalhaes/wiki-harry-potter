const liste = document.querySelector(".characters");

async function chargerPersonnages() {
  try {
    const reponse = await fetch("https://hp-api.onrender.com/api/characters");
    if (!reponse.ok) throw new Error("erreur");
    const personnages = await reponse.json();

    const premiersPersonnages = personnages;
    afficherPersonnages(premiersPersonnages);

    document.querySelectorAll(".houses button").forEach((maison) => {
      maison.addEventListener("click", () => {
        const personnagesTries = premiersPersonnages
          .filter((personnage) => personnage.house === maison.id)
          .sort((a, b) => (a.name || "").localeCompare(b.name || "", "fr"));

        afficherPersonnages(personnagesTries);
      });
    });
  } catch (erreur) {
    liste.textContent = "impossible de voir les personnages";
  }
}

function afficherPersonnages(personnages) {
  liste.textContent = "";

  personnages.forEach((personnage) => {
    const carte = document.createElement("div");
    carte.className = "characters__container__item";
    carte.innerHTML = `
      ${personnage.name === "Harry Potter" ? '<a href="details.html"><img /></a>' : '<img />'}
      <p></p>
    `;
    carte.querySelector("p").textContent = personnage.name || "undefined";
    carte.querySelector("img").src = personnage.image || "undefined";
    carte.querySelector("img").alt = personnage.name || "undefined";
    carte.querySelector("img").setAttribute("data-house", personnage.house || "undefined");
    liste.appendChild(carte);
  });
  if (personnages.length === 0) liste.textContent = "rien est trouvé";

  liste.querySelectorAll("img").forEach((image) => {
    image.onerror = () => {
      image.onerror = null;
      image.src = "./images/logo.png";
    };
  });
}

if (liste) chargerPersonnages();