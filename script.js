const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const nameText = document.getElementById("pokemon-name");
const idText = document.getElementById("pokemon-id");
const weightText = document.getElementById("weight");
const heightText = document.getElementById("height");
const imgDiv = document.getElementById("img-div");
const typesContainer = document.getElementById("types");
const hpText = document.getElementById("hp");
const attackText = document.getElementById("attack");
const defenseText = document.getElementById("defense");
const specialAtkText = document.getElementById("special-attack");
const specialDefText = document.getElementById("special-defense");
const speedText = document.getElementById("speed");
const rotateBtn = document.getElementById("rotate-icon");
const nextBtn = document.querySelector(".right");
const previousBtn = document.querySelector(".left");
const pokemonApi = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon";
const statsTxtArr = [hpText, attackText, defenseText, specialAtkText, specialDefText, speedText];

let pokemonData = [];
let pokemonExists = false;
let pokemonInfo;
let pokemonId;
let pokemonName;
let pokemonIndex;

searchBtn.addEventListener("click", () => {
  clear();
  searchPokemon();
});

const searchPokemon = () => {
  fetch(pokemonApi)
      .then((response) => response.json())
      .then((data) => {
          pokemonData = data;
          doesPokemonExist(pokemonData);
      })
      .catch((err) => console.log(err));
};

const doesPokemonExist = ({results}) => {
  const idList = [];
  const nameList = [];
  results.forEach((result) => {
    idList.push(result.id);
    nameList.push(result.name);
  })

  if (idList.includes(parseInt(searchInput.value))) {
    pokemonId = parseInt(searchInput.value);
    pokemonIndex = idList.indexOf(pokemonId);
    pokemonInfo = results[pokemonIndex];
  } else if (nameList.includes(searchInput.value.toLowerCase())) {
    pokemonName = searchInput.value. toLowerCase();
    pokemonIndex = nameList.indexOf(pokemonName);
    pokemonInfo = results[pokemonIndex];
  }

  if (pokemonInfo) {
    updateProfile(pokemonInfo);
    searchInput.value = "";
    return;
  } else {
    alert("Pokemon not found");
    clear();
    searchInput.value = ""; 
    return;
  }
}

const updateProfile = (pokemonInfo) => {
  const {id, name, url} = pokemonInfo;
  idText.textContent = "#" + id;
  nameText.textContent = name.toUpperCase();

  let pokemonProfile;

  // adding an "s" behind http to create the new URl//

  const newUrl = url.slice(0,4) + "s" + url.slice(4);
  fetch(newUrl)
    .then((response) => response.json())
    .then((data) => {
      pokemonProfile = data;

      const {sprites, stats, height, weight, types} = pokemonProfile;
      heightText.textContent = "Height: " + height;
    weightText.textContent = "Weight: " + weight;

// displaying the sprite //

    const {back_default, back_shiny, front_default, front_shiny} = sprites;
    imgDiv.innerHTML = `<img id="sprite" src="${front_default}">`;

// rotating the sprite //

    let rotate = false;
    rotateBtn.addEventListener("click", () => {
  if (!rotate) {
    imgDiv.innerHTML = `<img id="sprite" src="${back_default}">`;
    rotate = true;
  } else {
    imgDiv.innerHTML = `<img id="sprite" src="${front_default}">`;
    rotate = false;
  }
});

    for (let i = 0; i < statsTxtArr.length; i++) {
      statsTxtArr[i].textContent = stats[i].base_stat;
    };

    typesContainer.innerHTML = "";
    types.forEach((obj) => {
      typesContainer.innerHTML += `<div class="${obj.type.name} type">${obj.type.name.toUpperCase()}</div>`;
    });
    })
    .catch((err) => console.log(err)); 
    
    searchInput.value = "";
    rotateBtn.style.display = "block";
    nextBtn.style.display = "block";
    previousBtn.style.display = "block";
    console.log(pokemonIndex);
    if (pokemonIndex === 0) {
      previousBtn.style.borderColor = "white";
    };
    if (pokemonIndex === 1301) {
      nextBtn.style.borderColor = "white";
    };
};

const clear = () => {
  nameText.textContent = "";
  idText.textContent = "";
  heightText.textContent = "";
  weightText.textContent = "";
  hpText.textContent = "";
  attackText.textContent = "";
  defenseText.textContent = "";
  specialAtkText.textContent = "";
  specialDefText.textContent = "";
  speedText.textContent = "";
  typesContainer.innerHTML = "";
  imgDiv.innerHTML = "";
  rotateBtn.style.display = "none";
  nextBtn.style.display = "none";
  previousBtn.style.display = "none";
}

nextBtn.addEventListener("click", () => {
  if (pokemonIndex < 1302) {
    pokemonIndex ++;
    clear();
    fetch(pokemonApi)
      .then((response) => response.json())
      .then((data) => {
          pokemonData = data;
          const {results} = pokemonData;
          pokemonInfo = results[pokemonIndex];
          updateProfile(pokemonInfo);
          searchInput.value = "";
      })
      .catch((err) => console.log(err));
  }
  if (pokemonIndex > 0 && pokemonIndex < 1302) {
    previousBtn.style.borderColor = "black";
    nextBtn.style.borderColor = "black";
  } else if (pokemonIndex === 1301) {
    nextBtn.style.borderColor = "white";
  }
});

previousBtn.addEventListener("click", () => {
  if (pokemonIndex > 0) {
    pokemonIndex --; 
    clear();
    fetch(pokemonApi)
      .then((response) => response.json())
      .then((data) => {
          pokemonData = data;
          const {results} = pokemonData;
          pokemonInfo = results[pokemonIndex];
          updateProfile(pokemonInfo);
          searchInput.value = "";
      })
      .catch((err) => console.log(err));
    console.log(pokemonIndex);
    }
    if (pokemonIndex > 0 && pokemonIndex < 1302) {
    previousBtn.style.borderColor = "black";
    nextBtn.style.borderColor = "black";
  } else if (pokemonIndex === 0) {
    previousBtn.style.borderColor = "white";
  }
});