const liste = document.querySelector(".characters");

async function chargerPersonnages() {
  try {
    const reponse = await fetch("https://hp-api.onrender.com/api/characters");
    if (!reponse.ok) throw new Error("erreur");
    const personnages = await reponse.json();

    const premiersPersonnages = personnages;
    let personnagesMaison = premiersPersonnages;
    let personnagesAffiches = premiersPersonnages;
    const recherche = document.querySelector("#recherche");
    recherche.disabled = false;

    function actualiserListe() {
      const nom = recherche.value.trim().toLowerCase();
      const resultats = personnagesAffiches.filter((personnage) =>
        (personnage.name || "").toLowerCase().includes(nom)
      );
      afficherPersonnages(resultats);
    }

    recherche.addEventListener("input", actualiserListe);
    actualiserListe();

    document.querySelector("#tri-az").disabled = false;
    document.querySelector("#tri-az").addEventListener("click", () => {
      personnagesAffiches = personnagesAffiches.sort((a, b) => (a.name || "").localeCompare(b.name || "", "fr"));
      actualiserListe();
    });

    document.querySelector("#tri-age").disabled = false;
    document.querySelector("#tri-age").addEventListener("click", () => {
      personnagesAffiches = personnagesAffiches.slice().sort((a, b) => dateNaissance(b) - dateNaissance(a));
      actualiserListe();
    });

    document.querySelector("#vivants").disabled = false;
    document.querySelector("#morts").disabled = false;

    document.querySelector("#vivants").addEventListener("click", () => {
      personnagesAffiches = personnagesMaison.filter((personnage) => personnage.alive === true);
      actualiserListe();
    });

    document.querySelector("#morts").addEventListener("click", () => {
      personnagesAffiches = personnagesMaison.filter((personnage) => personnage.alive === false);
      actualiserListe();
    });

    document.querySelectorAll(".houses button").forEach((maison) => {
      maison.addEventListener("click", () => {
        personnagesMaison = premiersPersonnages
          .filter((personnage) => personnage.house === maison.id)
          .sort((a, b) => (a.name || "").localeCompare(b.name || "", "fr"));

        personnagesAffiches = personnagesMaison;
        actualiserListe();
      });
    });
  } catch (erreur) {
    liste.textContent = "impossible de voir les personnages";
  }
}
function dateNaissance(personnage) {
  if (personnage.dateOfBirth) {
    const [jour, mois, annee] = personnage.dateOfBirth.split("-");
    const date = Date.UTC(Number(annee), Number(mois) - 1, Number(jour));
    if (!Number.isNaN(date)) return date;
  }
  return personnage.yearOfBirth ? Date.UTC(personnage.yearOfBirth, 0, 1) : -Infinity;
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
