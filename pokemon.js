const max_pokemon = 151;
const listWrapper = document.querySelector(".list-wrapper");
const searchInput = document.querySelector("#search-input");
const numberFilter = document.querySelector("#number");
const nameFilter = document.querySelector("#name");
const notFoundMessage = document.querySelector("#not-found-message");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${max_pokemon}`)
.then((response) => response.json())
.then((data) => {
    allPokemons = data.results;
    displayPokemons(allPokemons);
    // console.log(allPokemons);
});

async function fetchPokemonDataBeforeRedirect(id)
{
    try
    {
        const[pokemon , pokemonSpecies] = await Promise.all([fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => 
            res.json()
        ),
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).
        then((res) => 
            res.json()
        ),
        ]);
        return true;
    }
    catch(error)
    {
        console.error("Failed to fetch pokemon data before redirecting");
    }
}

function displayPokemons(pokemon) {
    listWrapper.innerHTML = "";

    pokemon.forEach((pokemon) =>{
        const pokemonID = pokemon.url.split("/")[6];
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class = "number-wrap">
                <p class = "caption-fonts">#${pokemonID}</p>
            </div>
            <div class = "img-wrap">
            <img src = "https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt = "${pokemon.name}>
            </div>
            <div class = "name-wrap">
                <p class = "body3-fonts">#${pokemon.name}</p>
            </div>
            <button onclick = "detailFunction(${pokemonID})" class = "button-wrapper detail-button"> Detail </button>
            <button class = "button-wrapper fight-button"> Fight </button>
        `;
        listWrapper.appendChild(listItem);
    });
}

async function detailFunction(pokemonID)
{
    const success = await fetchPokemonDataBeforeRedirect(pokemonID);
    if(success)
    {
        window.location.href = `./details.html?id=${pokemonID}`;
    }
}

searchInput.addEventListener("keyup" , () =>{
    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons;

    if(numberFilter.checked){
        filteredPokemons = allPokemons.filter((pokemon) =>{
            const pokemonID = pokemon.url.split("/")[6];
            return pokemonID.startsWith(searchTerm);
        });
        console.log(1);
    }
    else if(nameFilter.checked){
        filteredPokemons = allPokemons.filter((pokemon) => {
            return pokemon.name.toLowerCase().startsWith(searchTerm);
        })
        console.log(1);
    }
    else
    {
        filteredPokemons = allPokemons;
    }

    displayPokemons(filteredPokemons);

    if(filteredPokemons.length === 0)
    {
        notFoundMessage.style.display = "block";
    }
    else
    {
        notFoundMessage.style.display = "none";
    }
})

const closeButton = document.querySelector(".search-close-icon");
closeButton.addEventListener("click" , () =>{
    searchInput.value = "";
    displayPokemons(allPokemons);
    notFoundMessage.style.display = "none";
})