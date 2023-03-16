const pokemonNames = document.querySelectorAll(".pokemon-name");
const pokemonImages = document.querySelectorAll(".centerImage");
const GenNew = document.getElementById("GenNew");
const resultImage = document.querySelector(".result-image");
const resultName = document.querySelector(".result-name");

// get all Pokemon IDs (up to 1008)
const pokemonIds = Array.from({ length: 1008 }, (_, index) => index + 1);

let isSpinning = false;

async function GenerateRandomPokemon() {
  // get random Pokemon ID
  const randomIndex = Math.floor(Math.random() * pokemonIds.length);
  const pokemonId = pokemonIds[randomIndex];

  // fetch Pokemon data from PokeAPI
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const data = await response.json();

  // determine if Pokemon is shiny: 1%
  const isShiny = Math.floor(Math.random() * 100) < 1;

  // determine if Pokemon is legendary or mythic: 1%
  const isLegendaryMythic = Math.floor(Math.random() * 100) < 1;
  const type = isShiny ? "front_shiny" : "front_default";

  // get Pokemon image and name
  let imageUrl, pokemonName;

  if (isLegendaryMythic) {
    // get random legendary or mythic Pokemon ID
    const legendaryMythicIds = [
      144, 145, 146, 150, 151, 
      243, 244, 245, 249, 250, 251, 
      385, 386, 
      480, 481, 482, 487, 
      491, 492, 493, 494, 
      647, 648, 649, 
      716, 717, 718, 
      719, 720, 721, 
      785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 
      800, 801, 802, 
      807, 808, 809, 810, 811, 
      888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 
      1008, 1007, 1002, 1003, 1001, 1004, 905,
  ];
      const randomLegendaryMythicIndex = Math.floor(Math.random() * legendaryMythicIds.length);
    const legendaryMythicId = legendaryMythicIds[randomLegendaryMythicIndex];

    // fetch legendary or mythic Pokemon data from PokeAPI
    const legendaryMythicResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${legendaryMythicId}`);
    const legendaryMythicData = await legendaryMythicResponse.json();

    imageUrl = legendaryMythicData.sprites[type];
    pokemonName = legendaryMythicData.name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("-");
  } else {
    imageUrl = data.sprites[type];
    pokemonName = data.name.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("-");
  }

  return {
    imageUrl,
    pokemonName,
    isShiny,
  };
}


function showResult(winnerPokemon) {
  resultImage.style.backgroundImage = `url('${winnerPokemon.imageUrl}')`;
  resultName.textContent = `${winnerPokemon.pokemonName}${winnerPokemon.isShiny ? " (Shiny!)" : ""}`;
  console.log(winnerPokemon)
}

// updates centerImage when gen new pokemon is clicked
async function updateImages() {
  if (isSpinning) {
    return;
  }

  isSpinning = true;
  GenNew.disabled = true;

  let pokemonArray = [];
  const maxIterations = 21; // number of iterations
  const delay = 150; // delay between iterations in milliseconds
  let iteration = 0;

  function spin() {
    GenerateRandomPokemon().then((newPokemon) => {
      // remove the first pokemon and shift the rest down
      const removedPokemon = pokemonArray.shift();
      pokemonArray.push(newPokemon);

      // update the images and names
      for (let i = 0; i < 7; i++) {
        pokemonImages[i].style.backgroundImage = `url('${pokemonArray[i].imageUrl}')`;
        pokemonNames[i].textContent = `${pokemonArray[i].pokemonName}${pokemonArray[i].isShiny ? " (Shiny!)" : ""}`;
      }
      iteration++;

      if (iteration < maxIterations) {
        setTimeout(spin, delay);
      } else {
        // the user wins the 4th pokemon
        const winnerPokemon = pokemonArray[3];
        isSpinning = false;
        showResult(winnerPokemon);
        GenNew.disabled = false;
      }
    });
  }

 
  // generate initial 7 pokemon
  for (let i = 0; i < 7; i++) {
    pokemonArray.push(await GenerateRandomPokemon());
    pokemonImages[i].style.backgroundImage = `url('${pokemonArray[i].imageUrl}')`;
    pokemonNames[i].textContent = `${pokemonArray[i].pokemonName}${pokemonArray[i].isShiny ? " (Shiny!)" : ""}`;
  }

  spin();
}

GenNew.addEventListener("click", updateImages);

// set initial images
updateImages();


