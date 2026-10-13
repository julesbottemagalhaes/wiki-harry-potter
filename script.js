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
      <a href="details.html?id=${encodeURIComponent(personnage.id)}"><img /></a>
      <p></p>
    `;
    carte.querySelector("p").textContent = personnage.name || "pas de nom";
    carte.querySelector("img").src = personnage.image || "undefined";
    carte.querySelector("img").alt = personnage.name || "undefined";
    carte.querySelector("img").setAttribute("data-house", personnage.house || "undefined");
    liste.appendChild(carte);
  });
  if (personnages.length === 0) liste.textContent = "rien est trouvé";

  liste.querySelectorAll("img").forEach((image) => {
    image.onerror = () => {
      image.onerror = null;
      image.src = "./images/troll.jpg";
    };
  });
}

if (liste) chargerPersonnages();

async function chargerDetails() {
  const fiche = document.querySelector(".page_perso main");
  const id = new URLSearchParams(window.location.search).get("id");

  if (!id) {
    fiche.textContent = "undefined";
    return;
  }

  try {
    const reponse = await fetch(`https://hp-api.onrender.com/api/character/${encodeURIComponent(id)}`);
    if (!reponse.ok) throw new Error("Erreur API");
    const personnages = await reponse.json();
    const personnage = personnages[0];
    if (!personnage) {
      fiche.textContent = "pas trouvé";
      return;
    }

    document.querySelector("#nom").textContent = personnage.name || "pas de nom";
    document.querySelector("#acteur").textContent = personnage.actor || "pas d'acteur";
    document.querySelector("#surnoms").textContent = (personnage.alternate_names || []).join(", ") || "pas de surnom";
    document.querySelector("#genre").textContent = personnage.gender || "pas de genre";
    document.querySelector("#yeux").textContent = personnage.eyeColour || "pas de couleur des yeux";
    document.querySelector("#cheveux").textContent = personnage.hairColour || "pas de couleur de cheveux";
    document.querySelector("#naissance").textContent = personnage.dateOfBirth || "pas de date de naissance";
    document.querySelector("#patronus").textContent = personnage.patronus || "pas de patronus";

    const photo = document.querySelector("#photo");
    photo.onerror = () => {
      photo.onerror = null;
      photo.src = "./images/troll.jpg";
    };
    photo.src = personnage.image || "./images/troll.jpg";
    photo.alt = personnage.name || "undefined";
    photo.style.filter = personnage.alive === false ? "grayscale(100%)" : "none";

    const maison = document.querySelector(".house__perso");
    if (["Gryffindor", "Hufflepuff", "Ravenclaw", "Slytherin"].includes(personnage.house)) {
      maison.querySelector("img").src = `./images/${personnage.house}.png`;
      maison.querySelector("img").alt = personnage.house;
    } else {
      maison.textContent = "Pas de maison"
    }
  } catch (erreur) {
    fiche.textContent = "";
  }
}

if (document.querySelector(".page_perso")) chargerDetails();

const boutonMenu = document.querySelector("#menu-bouton");
if (boutonMenu) {
  boutonMenu.addEventListener("click", () => {
    document.querySelector("#menu-liste").classList.toggle("menu-ouvert");
  });
}
